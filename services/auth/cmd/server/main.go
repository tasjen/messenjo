package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net"
	"net/http"
	"os"
	"runtime/debug"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	auth_pb "github.com/tasjen/messenjo/services/auth/internal/gen/auth"
	chat_pb "github.com/tasjen/messenjo/services/auth/internal/gen/chat"
	"github.com/tasjen/messenjo/services/auth/internal/models"
	oa2 "github.com/tasjen/messenjo/services/auth/internal/oauth2"
)

var (
	IS_PROD    bool
	JWT_SECRET = os.Getenv("JWT_SECRET")
)

type application struct {
	logger     *slog.Logger
	providers  map[string]oa2.Provider
	accounts   models.IAccountModel
	chatClient chat_pb.ChatClient
	auth_pb.UnimplementedAuthServer
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("%v: %v", err, debug.Stack())
	}
}

func run() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var err error
	if IS_PROD, err = strconv.ParseBool(os.Getenv("IS_PROD")); err != nil {
		return err
	}
	awsConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return fmt.Errorf("unable to load SDK config, %v", err)
	}

	chatConn, err := grpc.NewClient(
		"chat:3000",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return fmt.Errorf("cannot connect to Chat service: %v", err)
	}
	defer chatConn.Close()

	accountTableName := os.Getenv("ACCOUNT_TABLE_NAME")
	if accountTableName == "" {
		return fmt.Errorf("please specify the name of DynamoDB table %v",
			"that stores user accounts `ACCOUNT_TABLE_NAME` in .env file")
	}

	app := &application{
		logger: slog.New(slog.NewJSONHandler(os.Stdout, nil)),
		providers: map[string]oa2.Provider{
			"github": oa2.NewGithubProvider(),
			"google": oa2.NewGoogleProvider(),
		},
		accounts: models.NewAccountModel(
			dynamodb.NewFromConfig(awsConfig),
			accountTableName,
		),
		chatClient: chat_pb.NewChatClient(chatConn),
	}

	tableExists, err := app.accounts.TableExists(ctx)
	switch {
	case err != nil:
		return err
	case !tableExists:
		return fmt.Errorf(
			"table `%v` doesn't exists. Please create one",
			accountTableName,
		)
	}

	go app.startGrpcService()

	srv := &http.Server{
		Addr:         ":3000",
		Handler:      app.recoverHttpServer(app.routes()),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Printf("HTTP server is running at %v", srv.Addr)
	return srv.ListenAndServe()
}

func (app *application) startGrpcService() {
	addr := ":3001"
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("%v: %v", err, debug.Stack())
	}

	s := grpc.NewServer(grpc.UnaryInterceptor(app.recoverGrpcServer))

	auth_pb.RegisterAuthServer(s, app)
	log.Printf("gRPC server is running at %v", addr)
	log.Fatalf("failed to serve: %v", s.Serve(lis))
}
