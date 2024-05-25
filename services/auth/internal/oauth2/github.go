package oauth2

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

type GithubAccountInfo struct {
	Id int `json:"id"`
	// Name string `json:"login"`
	Pfp string `json:"avatar_url"`
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
	req, err := http.NewRequest(http.MethodGet, "https://api.github.com/user", nil)
	if err != nil {
		return &AccountInfo{}, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return &AccountInfo{}, err
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return &AccountInfo{}, err
	}

	var data GithubAccountInfo
	err = json.Unmarshal(resBody, &data)

	switch {
	case err != nil:
		return &AccountInfo{}, err
	case data.Id == 0:
		return &AccountInfo{}, errors.New("`id` field is missing from googleapi response")
		// case data.Name == "":
		// 	return &AccountInfo{}, errors.New("`login`(username) field is missing from github response")
	}

	return &AccountInfo{Id: fmt.Sprint(data.Id), Pfp: data.Pfp}, nil
}
