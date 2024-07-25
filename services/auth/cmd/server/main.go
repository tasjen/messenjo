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

	"github.com/aws/aws-sdk-go-v2/aws"
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

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

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

	authDbClient, err := newAuthDbClient(ctx)
	if err != nil {
		return err
	}

	app := &application{
		logger: slog.New(slog.NewJSONHandler(os.Stdout, nil)),
		providers: map[string]oa2.Provider{
			"github": oa2.NewGithubProvider(),
			"google": oa2.NewGoogleProvider(),
		},
		accounts: models.NewAccountModel(
			authDbClient,
			accountTableName,
		),
		chatClient: chat_pb.NewChatClient(chatConn),
	}

	// check if account table exists, if not then creates one
	err = app.accounts.CreateTableIfNotExists(ctx)
	if err != nil {
		return fmt.Errorf("cannot create table '%s': %v", accountTableName, err)
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

func newAuthDbClient(ctx context.Context) (*dynamodb.Client, error) {
	awsConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return &dynamodb.Client{}, err
	}

	localAuthDbEndpoint := "http://authdb:8000"
	// wait for authdb instance to spin up. 'depends_on' attribute in docker compose file doesn't work
	if !*isProd {
		client := &http.Client{}
		for i := 0; i < 10; i++ {
			resp, err := client.Get(localAuthDbEndpoint)
			if err != nil {
				if i == 9 {
					return &dynamodb.Client{}, fmt.Errorf("cannot connect to local authdb: %v", err)
				}
				time.Sleep(time.Second)
				continue
			}
			resp.Body.Close()
			break
		}
	}

	c := dynamodb.NewFromConfig(awsConfig,
		func(o *dynamodb.Options) {
			if !*isProd {
				o.BaseEndpoint = aws.String(localAuthDbEndpoint)
			}
		},
	)

	return c, nil
}
