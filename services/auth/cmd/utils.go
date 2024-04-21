package main

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

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
		Secure:   isProd,
		SameSite: http.SameSiteDefaultMode,
		MaxAge:   int((time.Minute * 2).Seconds()),
	})
}

// Converts claims to jwt string and sets it in the cookie
// with the same age as the claims
func setJwtCookie(w http.ResponseWriter, claims *jwtClaims) error {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtValue, err := jwtToken.SignedString([]byte(JWT_SECRET))
	if err != nil {
		return err
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_jwt",
		Value:    jwtValue,
		Path:     "/",
		HttpOnly: true,
		Secure:   isProd,
		SameSite: http.SameSiteDefaultMode,
		MaxAge:   int(claims.Exp),
	})

	return nil
}
