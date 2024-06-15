package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"

	"google.golang.org/grpc"
)

func (app *application) recoverHttpServer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if p := recover(); p != nil {
				w.Header().Set("Connection", "close")
				serverError(w)
				app.logger.Error(fmt.Sprintf("[PANIC] %v", p), slog.String("trace", string(debug.Stack())))
			}
		}()
		next.ServeHTTP(w, r)
	})
}

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
