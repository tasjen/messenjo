package main

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/url"

	auth_pb "github.com/tasjen/messenjo/services/chat/internal/gen/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

var internalServerError = status.Error(codes.Internal, "internal server error")
var unauthorizedError = status.Error(codes.Unauthenticated, "unauthorized")

func getToken(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", errors.New("no metadata")
	}

	rawCookieArr := md.Get("cookie")
	if len(rawCookieArr) == 0 {
		return "", errors.New("no cookies")
	}

	header := http.Header{}
	header.Add("Cookie", rawCookieArr[0])
	r := http.Request{Header: header}
	token, err := r.Cookie("auth_jwt")
	return token.Value, err
}

func verifyUser(ctx context.Context, userId []byte, authClient auth_pb.AuthClient) error {
	token, err := getToken(ctx)
	if err != nil {
		return err
	}
	authResp, err := authClient.VerifyToken(ctx, &auth_pb.VerifyTokenReq{Token: token})
	if err != nil {
		return err
	}
	if !bytes.Equal(authResp.UserId, userId) {
		return errors.New("unauthorized, received userId doesn't match")
	}
	return nil
}

func isValidUrl(s string) bool {
	u, err := url.Parse(s)
	if err != nil {
		return false
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return false
	}

	return true
}

func parsePfp(s string) (string, error) {
	if len(s) == 0 {
		return s, nil
	}
	if len(s) > 1024 {
		return "", errors.New("profile picture's url must not exceed 1024 characters")
	}
	if !isValidUrl(s) {
		return "", errors.New("invalid url")
	}
	return s, nil
}
