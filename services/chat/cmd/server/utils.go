package main

import (
	"bytes"
	"context"
	"errors"
	"net/http"

	auth_pb "github.com/tasjen/messenjo/services/chat/internal/gen/auth"
	"google.golang.org/grpc/metadata"
)

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
