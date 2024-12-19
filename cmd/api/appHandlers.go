package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (app *App) genereateWords(c echo.Context) error {
	data := []string{"murky", "miniature", "industry", "goose", "voice", "bite", "laugh", "elite", "snakes", "good-bye", "flee", "act", "steady", "horses", "mindless", "exultant", "massive", "tranquil", "observe", "hope", "well"}
	return c.JSON(http.StatusOK, data)
}


