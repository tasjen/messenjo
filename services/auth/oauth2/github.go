package oauth2

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

type GithubAccountInfo struct {
	Id   int    `json:"id"`
	Name string `json:"login"`
	// Picture  string `json:"avatar_url"`
}

type GithubProvider struct {
	config *oauth2.Config
}

func NewGithubProvider() *GithubProvider {
	return &GithubProvider{
		config: &oauth2.Config{
			ClientID:     os.Getenv("GITHUB_KEY"),
			ClientSecret: os.Getenv("GITHUB_SECRET"),
			RedirectURL:  "http://" + os.Getenv("DOMAIN") + "/api/auth/callback/github",
			Endpoint:     github.Endpoint,
			Scopes:       []string{"user"},
		}}
}

func (g *GithubProvider) Config() *oauth2.Config {
	return g.config
}

func (g *GithubProvider) FetchAccountInfo(accessToken string) (*AccountInfo, error) {
	req := fiber.Get("https://api.github.com/user")
	req.Set("Authorization", "Bearer "+accessToken)
	_, rawBody, errs := req.Bytes()

	if len(errs) > 0 {
		return &AccountInfo{}, errors.New("cannot get userinfo from api.github")
	}

	var data GithubAccountInfo
	err := json.Unmarshal(rawBody, &data)

	switch {
	case err != nil:
		return &AccountInfo{}, err
	case data.Id == 0:
		return &AccountInfo{}, errors.New("`id` field is missing from googleapi response")
	case data.Name == "":
		return &AccountInfo{}, errors.New("`login`(username) field is missing from googleapi response")
	}

	return &AccountInfo{Id: fmt.Sprint(data.Id), Name: data.Name}, nil
}
