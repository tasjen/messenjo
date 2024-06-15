package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"runtime/debug"

	"google.golang.org/grpc"
)

func (app *application) recoverGrpcServer(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (res interface{}, err error) {
	defer func() {
		if p := recover(); p != nil {
			app.logger.Error(fmt.Sprintf("[PANIC] %v", p), slog.String("trace", string(debug.Stack())))
			err = errors.New("internal server panic")
		}
	}()
	res, err = handler(ctx, req)
	if err != nil {
		app.logger.Error(err.Error())
	}
	return res, err
}
