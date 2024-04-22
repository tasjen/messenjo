package main

import (
	"context"
	"log"
	"net"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	pb "github.com/tasjen/message-app-fullstack/services/chat/internal/chat_proto"
	"github.com/tasjen/message-app-fullstack/services/chat/internal/models"
	"google.golang.org/grpc"
)

var isProd bool

type chatServer struct {
	users models.IUserModel
	pb.UnimplementedChatServer
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	if buffer, err := strconv.ParseBool(os.Getenv("isProd")); err != nil {
		log.Fatal(err)
	} else {
		isProd = buffer
		println(isProd)
	}

	pool, err := getDbPool(ctx, os.Getenv("POSTGRESQL_URI"))
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	lis, err := net.Listen("tcp", ":3000")
	if err != nil {
		log.Fatal(err)
	}

	s := grpc.NewServer()
	srv := &chatServer{
		users: &models.UserModel{
			DB: pool,
		},
	}

	pb.RegisterChatServer(s, srv)
	log.Printf("gRPC service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func getDbPool(ctx context.Context, pgURI string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, pgURI)
	if err != nil {
		return &pgxpool.Pool{}, err
	}
	if err = pool.Ping(ctx); err != nil {
		return &pgxpool.Pool{}, err
	}
	return pool, nil
}
