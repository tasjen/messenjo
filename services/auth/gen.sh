export PATH="$PATH:$(go env GOPATH)/bin"
protoc --go_out=. \
--go_opt=paths=source_relative \
--go-grpc_out=. \
--go-grpc_opt=paths=source_relative \
internal/auth_proto/auth.proto