package main

import (
	"context"
	"log"
	"net"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	pb "github.com/tasjen/message-app-fullstack/services/chat/internal/chat_proto"
	"github.com/tasjen/message-app-fullstack/services/chat/internal/models"
	"google.golang.org/grpc"
)

type application struct {
	errorLog *log.Logger
	users    models.IUserModel
	groups   models.IGroupModel
	members  models.IMemberModel
	messages models.IMessageModel
	pb.UnimplementedChatServer
}

func main() {
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	pool, err := getDbPool(ctx, os.Getenv("POSTGRESQL_URI"))
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	models.DB = pool

	lis, err := net.Listen("tcp", ":3000")
	if err != nil {
		log.Fatal(err)
	}

	s := grpc.NewServer()
	app := &application{
		errorLog: errorLog,
		users:    models.NewUserModel(),
		groups:   models.NewGroupModel(),
		members:  models.NewMemberModel(),
		messages: models.NewMessageModel(),
	}

	pb.RegisterChatServer(s, app)
	log.Printf("gRPC service listening at %v", lis.Addr())
	log.Fatalf("failed to serve: %v", s.Serve(lis))
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
