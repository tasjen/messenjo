package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v5"
)

func verifyHandler(c *fiber.Ctx) error {
	tokenString := c.Query("token")
	token, err := jwt.Parse(tokenString, keyFunc)
	if err != nil {
		log.Error(err)
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	return c.JSON(token.Claims)
}

func oauthLoginHandler(c *fiber.Ctx) error {
	providerName := c.Params("provider")
	provider, ok := Providers[providerName]
	if !ok {
		log.Error("invalid provider")
		return c.Redirect("/login")
	}
	oauthState := generateOauthState()

	c.Cookie(&fiber.Cookie{
		Name:     "oauthstate",
		Value:    oauthState,
		HTTPOnly: true,
		Path:     "/",
	})

	URL := provider.Config().AuthCodeURL(oauthState)

	return c.Redirect(URL)
}

func oauthCallbackHandler(c *fiber.Ctx) error {
	providerName := c.Params("provider")
	provider, ok := Providers[providerName]
	if !ok {
		log.Error("invalid provider")
		return c.Redirect("/login")
	}

	if c.Query("error") != "" {
		return c.Redirect("/login")
	}

	if c.Query("state") != c.Cookies("oauthstate") {
		log.Error("callback state does not match oauthstate")
		return c.Redirect("/login")
	}

	code := c.Query("code")
	token, err := provider.Config().Exchange(c.Context(), code)
	if err != nil {
		log.Error(err)
		return c.Redirect("/login")
	}

	account, err := provider.FetchAccountInfo(token.AccessToken)
	if err != nil {
		log.Error(err)
		return c.Redirect("/login")
	}

	if err := setJwtCookie(c, account); err != nil {
		log.Error(err)
		return c.Redirect("/login")
	}

	return c.Redirect("/")
}
