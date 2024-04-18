package oauth2

import (
	"encoding/json"
	"errors"
	"os"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type GoogleAccountInfo struct {
	Id   string `json:"sub"`
	Name string `json:"given_name"`
	// Picture  string `json:"picture"`
}

type GoogleProvider struct {
	config *oauth2.Config
}

func NewGoogleProvider() *GoogleProvider {
	return &GoogleProvider{
		config: &oauth2.Config{
			ClientID:     os.Getenv("GOOGLE_KEY"),
			ClientSecret: os.Getenv("GOOGLE_SECRET"),
			RedirectURL:  "http://" + os.Getenv("DOMAIN") + "/api/auth/callback/google",
			Endpoint:     google.Endpoint,
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile"},
		}}
}

func (g *GoogleProvider) Config() *oauth2.Config {
	return g.config
}

func (g *GoogleProvider) FetchAccountInfo(accessToken string) (*AccountInfo, error) {
	res := fiber.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken)
	_, rawBody, errs := res.Bytes()
	if len(errs) > 0 {
		return &AccountInfo{}, errors.New("cannot get userinfo from googleapis")
	}

	var data GoogleAccountInfo
	err := json.Unmarshal(rawBody, &data)

	switch {
	case err != nil:
		return &AccountInfo{}, err
	case data.Id == "":
		return &AccountInfo{}, errors.New("`sub`(id) field is missing from googleapi response")
	case data.Name == "":
		return &AccountInfo{}, errors.New("`name` field is missing from googleapi response")
	}

	return &AccountInfo{Id: data.Id, Name: data.Name}, nil
}
