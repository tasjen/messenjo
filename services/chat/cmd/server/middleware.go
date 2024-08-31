package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"
	"slices"

	"github.com/google/uuid"
	auth_pb "github.com/tasjen/messenjo/services/chat/internal/gen/auth"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type userIdKey struct{}

func (app *application) errorHandler(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (res interface{}, err error) {
	defer func() {
		if p := recover(); p != nil {
			app.logger.Error(
				fmt.Sprintf("[PANIC] %v", p),
				slog.String("trace", string(debug.Stack())),
			)
			err = internalServerError
		}
	}()
	// call authHandler
	res, err = handler(ctx, req)
	if err != nil {
		status, ok := status.FromError(err)
		code := status.Code()
		if !ok {
			app.logger.Error(
				fmt.Sprint("[UNKNOWN] error is not a status error: ", err),
				slog.String("trace", string(debug.Stack())))
			err = internalServerError
		} else if code == codes.Unknown || code == codes.Internal {
			app.logger.Error(
				err.Error(),
				slog.String("trace", string(debug.Stack())),
			)
			err = internalServerError
		} else if code == codes.Unauthenticated {
			app.logger.Error(err.Error())
			err = unauthorizedError
		}
	}
	return res, err
}

func (app *application) authHandler(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	// no auth for CreateUser (called by Auth service)
	if slices.Contains([]string{
		"/messenjo.Chat/CreateUser",
	},
		info.FullMethod,
	) {
		return handler(ctx, req)
	}
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Error(codes.Unauthenticated, "no metadata")
	}

	rawCookieArr := md.Get("cookie")
	if len(rawCookieArr) == 0 {
		return nil, status.Error(codes.Unauthenticated, "no cookie")
	}

	header := http.Header{}
	header.Add("Cookie", rawCookieArr[0])
	r := http.Request{Header: header}
	token, err := r.Cookie("auth_jwt")
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "no auth cookie")
	}

	authResp, err := app.authClient.VerifyToken(
		ctx,
		&auth_pb.VerifyTokenReq{Token: token.Value},
	)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, err.Error())
	}

	ctx = context.WithValue(ctx, userIdKey{}, uuid.UUID(authResp.UserId))
	// call serviceHandler
	return handler(ctx, req)
}
