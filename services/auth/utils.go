package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	oa2 "github.com/tasjen/message-app-fullstack/auth-service/oauth2"
)

// A callback which validates the token signing method
// then returns jwt secret for verifying the token
func keyFunc(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	}
	return []byte(JWT_SECRET), nil
}

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

// Converts account(claims) to jwt string and sets it in the cookie with 24hr max age
func setJwtCookie(w http.ResponseWriter, account *oa2.AccountInfo) error {
	age := time.Hour * 24

	claims := jwt.MapClaims{
		"id":  account.Id,
		"exp": time.Now().Add(age).Unix(),
	}

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
		MaxAge:   int(age.Seconds()),
	})

	return nil
}
