package main

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func (app *App) genereateWords(c echo.Context) error {
	data := []string{"murky", "miniature", "industry", "goose", "voice", "bite", "laugh", "elite", "snakes", "good-bye", "flee", "act", "steady", "horses", "mindless", "exultant", "massive", "tranquil", "observe", "hope", "well"}
	return c.JSON(http.StatusOK, data)
}

func (app *App) connect(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	for {
		mt, message, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error("Read error:", err)
		}
		c.Logger().Info("Received: %s", message)

		// Echo message back to client
		err = ws.WriteMessage(mt, message)
		if err != nil {
			c.Logger().Error("Write error:", err)
		}
	}
}
