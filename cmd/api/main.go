package main

import (
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type App struct {
}

func main() {
	app := App{}

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:*"},
		AllowCredentials: true,
	}))
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(session.Middleware(sessions.NewCookieStore([]byte("secret"))))

	e.Use(addUserInfo)
	e.GET("/words", app.genereateWords)
	e.GET("/read-session", readSession)
	e.GET("/connect", app.connect)
	// e.GET("/session", createSession)

	e.Logger.Fatal(e.Start(":8000"))

	// room  user join
	// user -> server commands
	// server -> user commands
}
