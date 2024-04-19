package main

import (
	"log"
	"net"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"

	oa2 "github.com/tasjen/message-app-fullstack/auth-service/oauth2"
	pb "github.com/tasjen/message-app-fullstack/auth-service/token-verifier"
)

var (
	Providers  = make(map[string]oa2.Provider)
	JWT_SECRET string
)

const isProd = false

type user struct {
	Id string `json:"id"`
	jwt.RegisteredClaims
}

type service struct {
	pb.UnimplementedTokenVerifierServer
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	go startGrpcService()

	JWT_SECRET = os.Getenv("JWT_SECRET")

	Providers["github"] = oa2.NewGithubProvider()
	Providers["google"] = oa2.NewGoogleProvider()

	app := http.NewServeMux()
	app.HandleFunc("GET /login/{provider}", oauthLoginHandler)
	app.HandleFunc("GET /callback/{provider}", oauthCallbackHandler)

	log.Printf("server listening at :3000")
	log.Fatal(http.ListenAndServe(":3000", app))
}

func startGrpcService() {
	lis, err := net.Listen("tcp", ":3001")
	if err != nil {
		log.Fatal(err)
	}
	s := grpc.NewServer()
	pb.RegisterTokenVerifierServer(s, &service{})
	log.Printf("gRPC service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
