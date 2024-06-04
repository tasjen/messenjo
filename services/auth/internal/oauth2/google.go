package oauth2

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type GoogleAccountInfo struct {
	Id string `json:"sub"`
	// Name string `json:"given_name"`
	Pfp string `json:"picture"`
}

type GoogleProvider struct {
	config *oauth2.Config
}

func NewGoogleProvider() *GoogleProvider {
	return &GoogleProvider{
		config: &oauth2.Config{
			ClientID:     os.Getenv("GOOGLE_KEY"),
			ClientSecret: os.Getenv("GOOGLE_SECRET"),
			RedirectURL:  "http://" + os.Getenv("HOST") + "/api/auth/callback/google",
			Endpoint:     google.Endpoint,
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile"},
		}}
}

func (g *GoogleProvider) Config() *oauth2.Config {
	return g.config
}

func (g *GoogleProvider) FetchAccountInfo(accessToken string) (*AccountInfo, error) {
	req, err := http.NewRequest(
		http.MethodGet,
		"https://www.googleapis.com/oauth2/v3/userinfo?access_token="+accessToken,
		nil,
	)
	if err != nil {
		return &AccountInfo{}, err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return &AccountInfo{}, err
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return &AccountInfo{}, err
	}

	var data GoogleAccountInfo
	err = json.Unmarshal(resBody, &data)

	switch {
	case err != nil:
		return &AccountInfo{}, err
	case data.Id == "":
		return &AccountInfo{}, errors.New("`sub`(id) field is missing from googleapi response")
		// case data.Name == "":
		// 	return &AccountInfo{}, errors.New("`name` field is missing from googleapi response")
	}

	return &AccountInfo{Id: data.Id, Pfp: data.Pfp}, nil
}
