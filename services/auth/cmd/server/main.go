package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"runtime/debug"
	"syscall"
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
	isProd           = flag.Bool("prod", false, "is production mode")
	httpPort         = flag.Int("httpPort", 3000, "http port")
	grpcPort         = flag.Int("grpcPort", 3001, "grpc port")
	jwtSecret        = os.Getenv("JWT_SECRET")
	accountTableName = os.Getenv("ACCOUNT_TABLE_NAME")
	chatServiceHost  = "chat:3000"
	httpServer       *http.Server
	grpcServer       *grpc.Server
	errCh            = make(chan error)
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
		log.Fatalf("%v: %v", err, string(debug.Stack()))
	} else {
		log.Println("Auth server has been gracefully shutdown")
	}
}

func run() error {
	flag.Parse()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	awsConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return fmt.Errorf("unable to load SDK config, %v", err)
	}

	// connect to Chat's gRPC server
	chatConn, err := grpc.NewClient(
		chatServiceHost,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return fmt.Errorf("cannot connect to Chat service: %v", err)
	}
	defer chatConn.Close()

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

	// check if account table exists
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

	httpServer = &http.Server{
		Addr:         fmt.Sprintf(":%d", *httpPort),
		Handler:      app.recoverHttpServer(app.routes()),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *grpcPort))
	if err != nil {
		return err
	}
	grpcServer = grpc.NewServer(grpc.UnaryInterceptor(app.recoverGrpcServer))
	auth_pb.RegisterAuthServer(grpcServer, app)

	// start http server
	go func() {
		if err := httpServer.ListenAndServe(); err != nil {
			errCh <- err
		}
	}()
	log.Printf("HTTP server is running at :%d", *httpPort)

	// start grpc server
	go func() {
		if err = grpcServer.Serve(lis); err != nil {
			errCh <- err
		}
	}()
	log.Printf("gRPC server is running at :%d", *grpcPort)

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
		log.Printf("signal '%v' detected, Auth server is being shutdown", sig)
		cancel()
		if err := httpServer.Shutdown(context.Background()); err != nil {
			return err
		}
		grpcServer.GracefulStop()
		return nil
	}
}
