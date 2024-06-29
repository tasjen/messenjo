package main

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var internalServerError = status.Error(codes.Internal, "internal server error")

// Generates a random 16-character base64 string
func generateOauthState() string {
	buffer := make([]byte, 16)
	rand.Read(buffer)
	state := base64.URLEncoding.EncodeToString(buffer)
	return state
}

// Set the generated oauthstate in cookie for increasing oauth2.0 security
func setOauthStateCookie(w http.ResponseWriter, oauthState string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "oauthstate",
		Value:    oauthState,
		Path:     "/",
		HttpOnly: true,
		Secure:   *isProd,
		SameSite: http.SameSiteDefaultMode,
		MaxAge:   int((time.Minute * 2).Seconds()),
	})
}

// Delete oauthstate cookie
func deleteOauthStateCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:   "oauthstate",
		Path:   "/",
		MaxAge: -1,
	})
}

// Converts claims to jwt string and sets it in the cookie
// with the same age as the claims
func setJwtCookie(w http.ResponseWriter, claims *jwtClaims) error {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtString, err := jwtToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return err
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_jwt",
		Value:    jwtString,
		Path:     "/",
		HttpOnly: true,
		Secure:   *isProd,
		SameSite: http.SameSiteDefaultMode,
		MaxAge:   int(claims.Exp - time.Now().Unix()),
	})

	return nil
}

func setNewUserCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "new_user",
		Path:     "/",
		HttpOnly: true,
		Secure:   *isProd,
		SameSite: http.SameSiteDefaultMode,
	})
}

func clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func serverError(w http.ResponseWriter) {
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}
