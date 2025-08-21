package main

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

var gameInstance = Game{
	WordList: []string{"murky", "miniature", "industry", "goose", "voice", "bite", "laugh", "elite", "snakes", "good-bye", "flee", "act", "steady", "horses", "mindless", "exultant", "massive", "tranquil", "observe", "hope", "well"},
	GameId:   "1",
	mu:       &sync.Mutex{},
	Players:  make(Players),
}

func (app *App) genereateWords(c echo.Context) error {
	data := []string{"murky", "miniature", "industry", "goose", "voice", "bite", "laugh", "elite", "snakes", "good-bye", "flee", "act", "steady", "horses", "mindless", "exultant", "massive", "tranquil", "observe", "hope", "well"}
	return c.JSON(http.StatusOK, data)
}

func (app *App) connect(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	session, err := session.Get("session", c)
	if err != nil {
		return err
	}
	id := session.Values["id"].(string)
	gameInstance.AddUserWithID(id, ws)
	gameInstance.HandleConnection(ws)

	return nil
}

func (app *App) gameTime(c echo.Context) error {
	// session, err := session.Get("session", c)
	// if err != nil {
	// 	return err
	// }
	// id := session.Values["id"].(string)
	// gameInstance.AddUserWithID(id)
	return c.JSON(http.StatusOK, gameInstance)
}
