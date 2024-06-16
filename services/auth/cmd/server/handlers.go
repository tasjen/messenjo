package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	auth_pb "github.com/tasjen/message-app-fullstack/services/auth/internal/gen/auth"
	chat_pb "github.com/tasjen/message-app-fullstack/services/auth/internal/gen/chat"
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
		clientError(w, http.StatusUnauthorized)
		app.logger.Warn("invalid provider name")
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
		clientError(w, http.StatusUnauthorized)
		app.logger.Warn("invalid provider name")
		return
	}

	oauthstate, err := r.Cookie("oauthstate")
	if err != nil {
		switch {
		case errors.Is(err, http.ErrNoCookie):
			clientError(w, http.StatusUnauthorized)
			app.logger.Warn("no oauthstate cookie found")
		default:
			serverError(w)
			app.logger.Error(err.Error())
		}
		return
	}

	if r.URL.Query().Get("state") != oauthstate.Value {
		clientError(w, http.StatusUnauthorized)
		app.logger.Warn("callback state does not match oauthstate")
		return
	}

	code := r.URL.Query().Get("code")
	token, err := provider.Config().Exchange(r.Context(), code)
	if err != nil {
		clientError(w, http.StatusUnauthorized)
		app.logger.Warn(fmt.Sprintf("failed to exchange code with access token : %v", err))
		return
	}

	oauthAccountInfo, err := provider.FetchAccountInfo(token.AccessToken)
	if err != nil {
		serverError(w)
		app.logger.Error(err.Error())
		return
	}

	// find oauth account in Auth DB
	account, err := app.accounts.Get(
		r.Context(),
		oauthAccountInfo.Id,
		providerName,
	)
	if err != nil {
		serverError(w)
		app.logger.Error(
			fmt.Sprintf("failed to get oauth account %v#%v from Auth DB: %v", providerName, oauthAccountInfo.Id, err),
		)
		return
	}

	// if account doesn't exist:
	if *account == (models.Account{}) {
		// create a user in Chat DB
		res, err := app.chatClient.CreateUser(
			r.Context(),
			&chat_pb.CreateUserReq{
				Username: fmt.Sprintf("%v#%v", providerName, oauthAccountInfo.Id),
				Pfp:      oauthAccountInfo.Pfp,
			})
		if err != nil {
			serverError(w)
			app.logger.Error(
				fmt.Sprintf("failed to create account %v#%v in Chat DB: %v", providerName, oauthAccountInfo.Id, err),
			)
			return
		}

		// extract the userId(uuid) returned from Chat service
		userId, err := uuid.FromBytes(res.GetUserId())
		if err != nil {
			serverError(w)
			app.logger.Error(err.Error())
			return
		}
		userIdString := userId.String()
		account.UserId = userIdString

		// then create an account in Auth DB using that id
		if err = app.accounts.Add(r.Context(), &models.Account{
			ProviderId:   oauthAccountInfo.Id,
			ProviderName: providerName,
			UserId:       userIdString,
			CreatedAt:    time.Now().Format(time.DateTime),
		}); err != nil {
			serverError(w)
			app.logger.Error(
				fmt.Sprintf("failed to create account %v#%v in Auth DB: %v", providerName, oauthAccountInfo.Id, err),
			)
			return
		}

		setNewUserCookie(w)
	}

	// Sign jwt to cookies with userId
	// before sending the response back to user
	claims := &jwtClaims{
		UserId: account.UserId,
		Exp:    time.Now().Add(time.Hour * 24).Unix(),
	}

	if err := setJwtCookie(w, claims); err != nil {
		serverError(w)
		app.logger.Error(
			fmt.Sprintf("failed to set jwt cookie %v : %v", claims, err),
		)
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

func (app *application) VerifyToken(ctx context.Context, req *auth_pb.VerifyTokenReq) (*auth_pb.VerifyTokenRes, error) {
	token, err := jwt.ParseWithClaims(
		req.GetToken(),
		&jwtClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(JWT_SECRET), nil
		})
	if err != nil {
		return &auth_pb.VerifyTokenRes{}, err
	}

	if !token.Valid {
		return &auth_pb.VerifyTokenRes{}, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*jwtClaims)
	if !ok {
		return &auth_pb.VerifyTokenRes{}, errors.New("failed asserting `token.Claims` to `*jwtClaims` type")
	}

	userId := uuid.MustParse(claims.UserId)

	return &auth_pb.VerifyTokenRes{UserId: userId[:]}, nil
}
