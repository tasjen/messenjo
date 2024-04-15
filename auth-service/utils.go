package main

import (
	"crypto/rand"
	"encoding/base64"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	oa2 "github.com/tasjen/message-app-fullstack/auth-service/oauth2"
)

// Generates a random 16-character base64 string for enhancing oauth2.0 security
func generateOauthState() string {
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	return state
}

// Converts account(claims) to jwt string and sets it in the cookie with 24hr max age
func setJwtCookie(c *fiber.Ctx, account *oa2.AccountInfo) error {
	age := time.Hour * 24

	claims := jwt.MapClaims{
		"id":   account.Id,
		"name": account.Name,
		"exp":  time.Now().Add(age).Unix(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtValue, err := jwtToken.SignedString([]byte(JWT_SECRET))
	if err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "auth_jwt",
		Value:    jwtValue,
		HTTPOnly: true,
		MaxAge:   int(age.Seconds()),
	})

	return nil
}
