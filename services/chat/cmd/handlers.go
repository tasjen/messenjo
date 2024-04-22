package main

import (
	"context"

	pb "github.com/tasjen/message-app-fullstack/services/chat/internal/chat_proto"
)

func (c *chatServer) CreateUser(ctx context.Context, req *pb.CreateUserReq) (*pb.CreateUserRes, error) {

	user_id, err := c.users.Add(ctx, req.GetUsername())
	if err != nil {
		return &pb.CreateUserRes{}, err
	}

	return &pb.CreateUserRes{UserId: user_id[:]}, nil
}
