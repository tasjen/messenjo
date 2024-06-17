package main

import (
	"context"
	"log"
	"log/slog"
	"net"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	pb "github.com/tasjen/messenjo/services/chat/internal/gen/chat"
	"github.com/tasjen/messenjo/services/chat/internal/models"
	"google.golang.org/grpc"
)

type application struct {
	logger    *slog.Logger
	users     models.IUserModel
	groups    models.IGroupModel
	members   models.IMemberModel
	messages  models.IMessageModel
	pubClient *redis.Client
	pb.UnimplementedChatServer
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	pool, err := getDbPool(ctx, os.Getenv("POSTGRESQL_URI"))
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	models.DB = pool

	addr := ":3000"
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatal(err)
	}

	app := &application{
		logger:   slog.New(slog.NewJSONHandler(os.Stdout, nil)),
		users:    models.NewUserModel(),
		groups:   models.NewGroupModel(),
		members:  models.NewMemberModel(),
		messages: models.NewMessageModel(),
		pubClient: redis.NewClient(&redis.Options{
			Addr: "redis:6379",
		}),
	}
	s := grpc.NewServer(grpc.UnaryInterceptor(app.recoverGrpcServer))

	pb.RegisterChatServer(s, app)
	log.Printf("Server is running at %v", addr)
	log.Fatalf("failed to serve: %v", s.Serve(lis))
}

func getDbPool(ctx context.Context, pgURI string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, pgURI)
	if err != nil {
		return &pgxpool.Pool{}, err
	}

	err = pool.Ping(ctx)
	return pool, err
}
