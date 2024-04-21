package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/tasjen/message-app-fullstack/auth-service/internal/models"
	pb "github.com/tasjen/message-app-fullstack/auth-service/token-verifier"
)

type jwtClaims struct {
	Id  string `json:"id"`
	Exp int64  `json:"exp"`
	jwt.RegisteredClaims
}

func (app *application) oauthLoginHandler(w http.ResponseWriter, r *http.Request) {
	providerName := r.PathValue("provider")
	provider, ok := app.providers[providerName]
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

func (app *application) oauthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	// delete oauthstate cookie
	http.SetCookie(w, &http.Cookie{
		Name:   "oauthstate",
		Path:   "/",
		MaxAge: -1,
	})

	providerName := r.PathValue("provider")
	provider, ok := app.providers[providerName]
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

	oauthAccountInfo, err := provider.FetchAccountInfo(token.AccessToken)
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	acc, err := app.accounts.Get(r.Context(), oauthAccountInfo.Id)
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}
	// if account doesn't exist, create one
	if acc == nil {
		err = app.accounts.Add(r.Context(), &models.Account{
			UserId:       oauthAccountInfo.Id, // change this to uuid
			ProviderName: providerName,
			ProviderId:   oauthAccountInfo.Id,
			CreatedAt:    time.Now().String(),
		})
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}
	}

	claims := &jwtClaims{
		Id:  oauthAccountInfo.Id, // change this to uuid
		Exp: time.Now().Add(time.Hour * 24).Unix(),
	}

	if err := setJwtCookie(w, claims); err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

func (s *tokenVerifierServer) VerifyToken(ctx context.Context, req *pb.AuthRequest) (*pb.AuthResponse, error) {
	token, err := jwt.ParseWithClaims(req.GetToken(), &jwtClaims{}, keyFunc)
	if err != nil {
		return &pb.AuthResponse{}, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*jwtClaims)
	if !ok {
		log.Println(errors.New("failed asserting `token.Claims` to `*jwtClaims` type"))
		return &pb.AuthResponse{}, errors.New("internal server error")
	}

	return &pb.AuthResponse{Id: claims.Id}, nil
}
