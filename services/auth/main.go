package main

import (
	"log"
	"net"
	"os"

	"github.com/gofiber/fiber/v2"
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

type User struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	jwt.RegisteredClaims
}

type server struct {
	pb.UnimplementedTokenVerifierServer
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	go startgRPCServer()

	JWT_SECRET = os.Getenv("JWT_SECRET")

	Providers["github"] = oa2.NewGithubProvider()
	Providers["google"] = oa2.NewGoogleProvider()

	app := fiber.New()

	app.Get("/login/:provider", oauthLoginHandler)
	app.Get("/callback/:provider", oauthCallbackHandler)

	log.Fatal(app.Listen(":3000"))
}

func startgRPCServer() {
	lis, err := net.Listen("tcp", ":3001")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterTokenVerifierServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
