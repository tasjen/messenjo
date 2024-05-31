package main

import (
	"context"

	"google.golang.org/grpc"
)

func (app *application) errHandler(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	res, err := handler(ctx, req)
	if err != nil {
		app.errorLog.Println(err)
	}
	return res, err
}
