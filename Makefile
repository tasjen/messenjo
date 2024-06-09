shell_chat=docker exec -it message-app-chat-dev /bin/sh -c
migration_command_path=/app/internal/database/migrations/migrate.sh

run_prod:
	@docker-compose up pgadmin chatdb -d
	@MY_UID=$$(id -u) MY_GID=$$(id -g) docker-compose up auth view chat reverse-proxy grpc-gateway streaming messagech

run_dev:
	@docker compose -f docker-compose.dev.yml up pgadmin chatdb -d
	@MY_UID=$$(id -u) MY_GID=$$(id -g) docker compose -f docker-compose.dev.yml up auth view chat reverse-proxy grpc-gateway streaming messagech

migration_create:
	@$(shell_chat) "migrate create -ext=.sql -dir=./internal/database/migrations $(NAME)"

migration_version:
	@$(shell_chat)	"$(migration_command_path) version"

migration_up:
	@$(shell_chat) "$(migration_command_path) -verbose up"

migration_down:
	@$(shell_chat) "$(migration_command_path) -verbose down"

migration_fix:
	@$(shell_chat) "$(migration_command_path) -verbose force $(VERSION)"

migration_goto:
	@$(shell_chat) "$(migration_command_path) -verbose goto $(VERSION)"
