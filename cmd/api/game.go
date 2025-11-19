package main

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

type Player struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Pos         [2]int `json:"pos"`
	CurrentWord string `json:"currentWord"`
	conn        *websocket.Conn
}

type Players map[string]*Player

type Game struct {
	WordList []string `json:"wordList"`
	GameId   string   `json:"gameId"`
	Players  Players  `json:"players"`
	mu       *sync.Mutex
}

func (g *Game) AddUserWithID(id string, conn *websocket.Conn) error {
	g.mu.Lock()
	defer g.mu.Unlock()
	_, ok := g.Players[id]
	if ok {
		return fmt.Errorf("Player with %s already exists", id)
	}
	player := Player{Id: id, Pos: [2]int{}, conn: conn}
	if len(g.Players) > 0 {
		player.Pos[0] = 1
	}
	g.Players[id] = &player
	return nil
}

type Cmd struct {
	CmdType string   `json:"cmd_type"`
	Args    []string `json:"args"`
	UserID  string   `json:"user_id"`
}

func (g *Game) HandleConnection(conn *websocket.Conn) {
	defer conn.Close()
	for {
		cmd := &Cmd{}
		err := conn.ReadJSON(cmd)
		if err != nil {
			return
		}
		//update
		switch cmd.CmdType {
		case "type":
			g.mu.Lock()
			user, ok := g.Players[cmd.UserID]
			if !ok {
				return
			}
			user.Pos[1]++
			user.CurrentWord += cmd.Args[0]
			g.mu.Unlock()

		}
		//
		go g.Broadcast(cmd)
	}
}

func (g *Game) Broadcast(cmd *Cmd) {
	for _, player := range g.Players {
		player.conn.WriteJSON(cmd)
	}

}
