usage() {
    echo "Usage: $0 [--service|--db|--all]"
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
    docker compose -f docker-compose.dev.yml up auth view reverse-proxy;;
  --db)
    docker compose -f docker-compose.dev.yml up chat-service-db pgadmin;;
  --all)
    docker compose -f docker-compose.dev.yml up;;
  *)
    echo "Error: Invalid option $1"
    usage;;
esac
