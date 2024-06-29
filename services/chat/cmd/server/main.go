package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net"
	"os"
	"os/signal"
	"runtime/debug"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	auth_pb "github.com/tasjen/messenjo/services/chat/internal/gen/auth"
	chat_pb "github.com/tasjen/messenjo/services/chat/internal/gen/chat"
	"github.com/tasjen/messenjo/services/chat/internal/models"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type application struct {
	logger      *slog.Logger
	data        models.IDataModel
	authClient  auth_pb.AuthClient
	redisClient *redis.Client
	chat_pb.UnimplementedChatServer
}

var (
	grpcPort        = flag.Int("grpcPort", 3000, "grpc port")
	postgresURI     = os.Getenv("POSTGRESQL_URI")
	authServiceHost = "auth:3001"
	redisHost       = "redis:6379"
	grpcServer      *grpc.Server
	errCh           = make(chan error)
)

func main() {
	if err := run(); err != nil {
		log.Fatalf("%v: %v", err, string(debug.Stack()))
	} else {
		log.Println("Chat server has been gracefully shutdown")
	}
}

func run() error {
	flag.Parse()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// connect to ChatDB
	pool, err := pgxpool.New(ctx, postgresURI)
	if err != nil {
		return err
	}
	err = pool.Ping(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	// connect to Auth's gRPC server
	authConn, err := grpc.NewClient(
		authServiceHost,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return fmt.Errorf("cannot connect to Auth service: %v", err)
	}
	defer authConn.Close()

	app := &application{
		logger:     slog.New(slog.NewJSONHandler(os.Stdout, nil)),
		data:       models.NewDataModel(pool),
		authClient: auth_pb.NewAuthClient(authConn),
		redisClient: redis.NewClient(&redis.Options{
			Addr: redisHost,
		}),
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *grpcPort))
	if err != nil {
		return err
	}
	grpcServer = grpc.NewServer(
		grpc.ChainUnaryInterceptor(
			app.errorHandler,
			app.authHandler,
		),
	)
	chat_pb.RegisterChatServer(grpcServer, app)

	// start grpc server
	go func() {
		if err = grpcServer.Serve(lis); err != nil {
			errCh <- err
		}
	}()
	log.Printf("Server is running at :%d", *grpcPort)

	// graceful shutdown
	sigCh := make(chan os.Signal, 1)
	signal.Notify(
		sigCh, os.Interrupt, syscall.SIGINT, syscall.SIGTERM,
	)
	defer signal.Stop(sigCh)

	select {
	case err := <-errCh:
		return err
	case sig := <-sigCh:
		log.Printf("signal '%v' detected, Chat server is being shutdown", sig)
		cancel()
		grpcServer.GracefulStop()
		return nil
	}
}
