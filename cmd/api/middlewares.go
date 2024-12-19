package main

import (
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func addUserInfo(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, err := session.Get("session", c)
		if err != nil {
			return nil
		}
		sess.Options = &sessions.Options{
			Path:     "/",
			MaxAge:   86400 * 7,
			HttpOnly: true,
		}
		if _, ok := sess.Values["id"]; !ok {
			sess.Values["id"] = uuid.NewString()
		}
		if _, ok := sess.Values["username"]; !ok {
			sess.Values["username"] = "Guest"
		}
		if err := sess.Save(c.Request(), c.Response()); err != nil {
			return nil
		}

		return next(c)
	}
}
