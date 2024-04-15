package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func authHandler(c *fiber.Ctx) error {
	jwtToken := c.Cookies("auth_jwt")
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		return []byte(JWT_SECRET), nil
	})

	switch {
	case err != nil:
		return err
	case token.Valid:
		return c.SendStatus(fiber.StatusOK)
	default:
		return c.SendStatus(fiber.StatusUnauthorized)
	}
}

func oauthLoginHandler(c *fiber.Ctx) error {
	providerName := c.Params("provider")
	provider, ok := Providers[providerName]
	if !ok {
		return fiber.ErrBadRequest
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
		return c.Status(400).JSON(fiber.Map{
			"error": fiber.ErrBadRequest.Error(),
		})
	}

	if c.Query("error") != "" {
		return c.Redirect("/login")
	}

	if c.Query("state") != c.Cookies("oauthstate") {
		return c.Status(400).JSON(fiber.Map{
			"error": fiber.ErrBadRequest.Error(),
		})
	}

	code := c.Query("code")
	token, err := provider.Config().Exchange(c.Context(), code)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	account, err := provider.FetchAccountInfo(token.AccessToken)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := setJwtCookie(c, account); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Redirect("/")
}
