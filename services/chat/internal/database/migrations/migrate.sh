migrate \
-path ./internal/database/migrations/ \
-database "${POSTGRESQL_URI}?sslmode=disable" \
$@