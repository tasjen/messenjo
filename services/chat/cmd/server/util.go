package main

import (
	"errors"
	"net/url"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var internalServerError = status.Error(codes.Internal, "internal server error")
var unauthorizedError = status.Error(codes.Unauthenticated, "unauthorized")

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
