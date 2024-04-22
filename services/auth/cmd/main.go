package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"google.golang.org/grpc"

	pb "github.com/tasjen/message-app-fullstack/services/auth/internal/auth_proto"
	"github.com/tasjen/message-app-fullstack/services/auth/internal/models"
	oa2 "github.com/tasjen/message-app-fullstack/services/auth/internal/oauth2"
)

const isProd = false

var JWT_SECRET string

type tokenVerifierServer struct {
	pb.UnimplementedTokenVerifierServer
}

type application struct {
	accounts  models.IAccountModel
	providers map[string]oa2.Provider
}

func main() {
	JWT_SECRET = os.Getenv("JWT_SECRET")

	go startGrpcService()

	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	awsConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	accountTableName := "message-app-fullstack-auth-db"
	if !isProd {
		accountTableName += "-dev"
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
	}

	tableExists, err := app.accounts.TableExists(ctx)
	switch {
	case err != nil:
		log.Fatal(err)
	case !tableExists:
		log.Fatalf("Table `%v` doesn't exists. Please create one", accountTableName)
	}

	srv := &http.Server{
		Addr:         ":3000",
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
	}

	log.Printf("server listening at :3000")
	log.Fatal(srv.ListenAndServe())
}

func startGrpcService() {
	lis, err := net.Listen("tcp", ":3001")
	if err != nil {
		log.Fatal(err)
	}
	s := grpc.NewServer()
	pb.RegisterTokenVerifierServer(s, &tokenVerifierServer{})
	log.Printf("gRPC service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
