package main

import (
	"context"
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	pb "github.com/tasjen/message-app-fullstack/auth-service/token-verifier"
)

func oauthLoginHandler(c *fiber.Ctx) error {
	providerName := c.Params("provider")
	provider, ok := Providers[providerName]
	if !ok {
		log.Println("invalid provider")
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
		log.Println("invalid provider")
		return c.Redirect("/login")
	}

	if c.Query("error") != "" {
		return c.Redirect("/login")
	}

	if c.Query("state") != c.Cookies("oauthstate") {
		log.Println("callback state does not match oauthstate")
		return c.Redirect("/login")
	}

	code := c.Query("code")
	token, err := provider.Config().Exchange(c.Context(), code)
	if err != nil {
		log.Println(err)
		return c.Redirect("/login")
	}

	account, err := provider.FetchAccountInfo(token.AccessToken)
	if err != nil {
		log.Println(err)
		return c.Redirect("/login")
	}

	if err := setJwtCookie(c, account); err != nil {
		log.Println(err)
		return c.Redirect("/login")
	}

	return c.Redirect("/")
}

func (s *server) VerifyToken(ctx context.Context, req *pb.AuthRequest) (*pb.AuthResponse, error) {
	token, err := jwt.ParseWithClaims(req.GetToken(), &User{}, keyFunc)
	if err != nil {
		log.Println(err)
		return &pb.AuthResponse{}, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*User)
	if !ok {
		return &pb.AuthResponse{}, errors.New("internal server error")
	}

	return &pb.AuthResponse{Id: claims.Id, Name: claims.Name}, nil
}
