FROM golang:1.22-bookworm as builder
WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o auth-service

FROM debian:bookworm-slim

WORKDIR /app

RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/auth-service .

CMD ["./app/auth-service"]