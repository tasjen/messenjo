package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	oa2 "github.com/tasjen/message-app-fullstack/auth-service/oauth2"
)

var (
	Providers  = make(map[string]oa2.Provider)
	JWT_SECRET string
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	JWT_SECRET = os.Getenv("JWT_SECRET")

	Providers["github"] = oa2.NewGithubProvider()
	Providers["google"] = oa2.NewGoogleProvider()

	app := fiber.New()

	app.Get("/auth", authHandler)

	app.Get("/login/:provider", oauthLoginHandler)
	app.Get("/callback/:provider", oauthCallbackHandler)

	log.Fatal(app.Listen(":3000"))
}
