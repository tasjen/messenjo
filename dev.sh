usage() {
    echo "Usage: $0 [--sv|--db|--all]"
    echo "Options:"
    echo "  --sv   Run all services without database"
    echo "  --db   Run only database"
    echo "  --all  Run all services"
    exit 1
}

# Check if an option is provided
if [ $# -ne 1 ]; then
    usage
fi

case "$1" in
  --sv)
    docker compose -f docker-compose.dev.yml up auth view chat reverse-proxy grpc-gateway;;
  --db)
    docker compose -f docker-compose.dev.yml up pgadmin chatdb -d;;
  --all)
    docker compose -f docker-compose.dev.yml up pgadmin chatdb -d
    docker compose -f docker-compose.dev.yml up auth view chat reverse-proxy grpc-gateway;;
  *)
    echo "Error: Invalid option $1"
    usage;;
esac