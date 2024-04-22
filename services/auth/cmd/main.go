package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	auth_pb "github.com/tasjen/message-app-fullstack/services/auth/internal/auth_proto"
	chat_pb "github.com/tasjen/message-app-fullstack/services/auth/internal/chat_proto"
	"github.com/tasjen/message-app-fullstack/services/auth/internal/models"
	oa2 "github.com/tasjen/message-app-fullstack/services/auth/internal/oauth2"
)

var (
	isProd     bool
	JWT_SECRET string
)

type (
	authServer struct {
		auth_pb.UnimplementedAuthServer
	}

	application struct {
		accounts   models.IAccountModel
		providers  map[string]oa2.Provider
		authServer *authServer
		chatClient chat_pb.ChatClient
	}
)

func main() {
	JWT_SECRET = os.Getenv("JWT_SECRET")

	if buffer, err := strconv.ParseBool(os.Getenv("isProd")); err != nil {
		log.Fatal(err)
	} else {
		isProd = buffer
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	awsConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	chatConn, err := grpc.Dial("chat:3000", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer chatConn.Close()

	accountTableName := os.Getenv("ACCOUNT_TABLE_NAME")
	if accountTableName == "" {
		log.Fatal("please specify the name of DynamoDB table ",
			"that stores user accounts `ACCOUNT_TABLE_NAME` in .env file")
	}

	app := &application{
		accounts: &models.AccountModel{
			DB:        dynamodb.NewFromConfig(awsConfig),
			TableName: accountTableName,
		},
		providers: map[string]oa2.Provider{
			"github": oa2.NewGithubProvider(),
			"google": oa2.NewGoogleProvider(),
		},
		chatClient: chat_pb.NewChatClient(chatConn),
	}

	tableExists, err := app.accounts.TableExists(ctx)
	switch {
	case err != nil:
		log.Fatal(err)
	case !tableExists:
		log.Fatalf("Table `%v` doesn't exists. Please create one", accountTableName)
	}

	go app.startGrpcService()

	srv := &http.Server{
		Addr:         ":3000",
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Printf("server listening at :3000")
	log.Fatal(srv.ListenAndServe())
}

func (app *application) startGrpcService() {
	lis, err := net.Listen("tcp", ":3001")
	if err != nil {
		log.Fatal(err)
	}
	s := grpc.NewServer()
	auth_pb.RegisterAuthServer(s, app.authServer)
	log.Printf("gRPC service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
