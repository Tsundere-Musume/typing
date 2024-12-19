package main

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type SessionData struct {
	UserId   string `json:"user_id"`
	Username string `json:"username"`
}

func createSession(c echo.Context) error {
	sess, err := session.Get("session", c)
	if err != nil {
		return err
	}

	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}

	sess.Values["id"] = uuid.NewString()
	sess.Values["username"] = "Guest"
	if err := sess.Save(c.Request(), c.Response()); err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}

func readSession(c echo.Context) error {
	session, err := session.Get("session", c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, SessionData{UserId: session.Values["id"].(string), Username: session.Values["username"].(string)})
}
