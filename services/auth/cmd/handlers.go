package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	auth_pb "github.com/tasjen/message-app-fullstack/services/auth/internal/auth_proto"
	chat_pb "github.com/tasjen/message-app-fullstack/services/auth/internal/chat_proto"
	"github.com/tasjen/message-app-fullstack/services/auth/internal/models"
)

type jwtClaims struct {
	UserId string `json:"user_id"`
	Exp    int64  `json:"exp"`
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

	http.Redirect(w, r, URL, http.StatusFound)
}

func (app *application) oauthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	deleteOauthStateCookie(w)

	providerName := r.PathValue("provider")
	provider, ok := app.providers[providerName]
	if !ok {
		log.Println("invalid provider")
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

	// find oauth account in Auth DB
	account, err := app.accounts.Get(
		r.Context(),
		oauthAccountInfo.Id,
		providerName,
	)
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/error", http.StatusFound)
		return
	}

	// if account doesn't exist:
	if *account == (models.Account{}) {
		// create a user in Chat DB
		res, err := app.chatClient.CreateUser(
			r.Context(),
			&chat_pb.CreateUserReq{
				Username: fmt.Sprintf("%v#%v", providerName, oauthAccountInfo.Id),
			})
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/error", http.StatusFound)
			return
		}

		// extract the userId(uuid) returned from Chat service
		userId, err := uuid.FromBytes(res.GetUserId())
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/error", http.StatusFound)
			return
		}

		// then create an account in Auth DB using that id
		if err = app.accounts.Add(r.Context(), &models.Account{
			ProviderId:   oauthAccountInfo.Id,
			ProviderName: providerName,
			UserId:       userId.String(),
			CreatedAt:    time.Now().Format(time.DateTime),
		}); err != nil {
			log.Println(err)
			http.Redirect(w, r, "/error", http.StatusFound)
			return
		}
	}

	// Sign jwt to cookies with userId
	// before sending the response back to user
	claims := &jwtClaims{
		UserId: account.UserId,
		Exp:    time.Now().Add(time.Hour * 24).Unix(),
	}

	if err := setJwtCookie(w, claims); err != nil {
		log.Println(err)
		http.Redirect(w, r, "/error", http.StatusFound)
		return
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

func (app *application) logoutHandler(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:   "auth_jwt",
		Path:   "/",
		MaxAge: -1,
	})

	http.Redirect(w, r, "/login", http.StatusFound)
}

func (*authServer) VerifyToken(ctx context.Context, req *auth_pb.AuthRequest) (*auth_pb.AuthResponse, error) {
	token, err := jwt.Parse(
		req.GetToken(),
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(JWT_SECRET), nil
		})
	if err != nil {
		log.Println(err)
		return &auth_pb.AuthResponse{}, err
	}

	if !token.Valid {
		return &auth_pb.AuthResponse{}, errors.New("invalid token")
	}

	return &auth_pb.AuthResponse{}, nil
}
