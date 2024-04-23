package main

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	pb "github.com/tasjen/message-app-fullstack/services/chat/internal/chat_proto"
)

func (c *chatServer) CreateUser(ctx context.Context, req *pb.CreateUserReq) (*pb.CreateUserRes, error) {
	userId := uuid.New()
	err := c.users.Add(ctx, userId, req.GetUsername())

	var pgErr *pgconn.PgError
	if err != nil && !(errors.As(err, &pgErr) && pgErr.Code == "23505") {
		return &pb.CreateUserRes{}, err
	}

	return &pb.CreateUserRes{UserId: userId[:]}, nil
}
