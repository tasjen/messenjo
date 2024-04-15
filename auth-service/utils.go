package main

import (
	"crypto/rand"
	"encoding/base64"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	oa2 "github.com/tasjen/message-app-fullstack/auth-service/oauth2"
)

func generateOauthState() string {
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	return state
}

func setJwtCookie(c *fiber.Ctx, account *oa2.AccountInfo) error {

	claims := jwt.MapClaims{
		"id":   account.Id,
		"name": account.Name,
		"exp":  time.Now().Add(time.Minute * 3).Unix(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	jwtValue, err := jwtToken.SignedString([]byte(JWT_SECRET))
	if err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "auth_jwt",
		Value:    jwtValue,
		HTTPOnly: true,
		Expires:  time.Now().Add(time.Minute * 1),
	})

	return nil
}
