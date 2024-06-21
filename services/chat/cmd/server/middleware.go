package main

import (
	"context"
	"fmt"
	"log/slog"
	"runtime/debug"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (app *application) recoverGrpcServer(
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
