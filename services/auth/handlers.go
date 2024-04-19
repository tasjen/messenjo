package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	pb "github.com/tasjen/message-app-fullstack/auth-service/token-verifier"
)

func oauthLoginHandler(w http.ResponseWriter, r *http.Request) {
	providerName := r.PathValue("provider")
	provider, ok := Providers[providerName]
	if !ok {
		log.Println("invalid provider")
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	oauthState := generateOauthState()
	setOauthStateCookie(w, oauthState)
	URL := provider.Config().AuthCodeURL(oauthState)

	http.Redirect(w, r, URL, http.StatusTemporaryRedirect)
}

func oauthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	providerName := r.PathValue("provider")
	provider, ok := Providers[providerName]
	if !ok {
		log.Println("invalid provider")
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	if r.URL.Query().Get("error") != "" {
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	oauthstate, err := r.Cookie("oauthstate")
	if err != nil {
		switch {
		case errors.Is(err, http.ErrNoCookie):
			http.Redirect(w, r, "/login", http.StatusFound)
		default:
			log.Println(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	if r.URL.Query().Get("state") != oauthstate.Value {
		log.Println(errors.New("callback state does not match oauthstate"))
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	code := r.URL.Query().Get("code")
	token, err := provider.Config().Exchange(r.Context(), code)
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	account, err := provider.FetchAccountInfo(token.AccessToken)
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}
	if err := setJwtCookie(w, account); err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	// delete oauthstate cookie
	http.SetCookie(w, &http.Cookie{
		Name:   "oauthstate",
		Path:   "/",
		MaxAge: -1,
	})

	http.Redirect(w, r, "/", http.StatusFound)
}

func (s *service) VerifyToken(ctx context.Context, req *pb.AuthRequest) (*pb.AuthResponse, error) {
	token, err := jwt.ParseWithClaims(req.GetToken(), &user{}, keyFunc)
	if err != nil {
		log.Println(err)
		return &pb.AuthResponse{}, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*user)
	if !ok {
		log.Println(errors.New("failed asserting `token.Claims` to `*User` type"))
		return &pb.AuthResponse{}, errors.New("internal server error")
	}

	return &pb.AuthResponse{Id: claims.Id}, nil
}
