package oauth2

import "golang.org/x/oauth2"

type AccountInfo struct {
	Id string
}

type Provider interface {
	FetchAccountInfo(accessToken string) (*AccountInfo, error)
	Config() *oauth2.Config
}
