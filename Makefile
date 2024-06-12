shell_chat=docker exec -it message-app-chat-dev /bin/sh -c
migration_command_path=/app/internal/database/migrations/migrate.sh

dev:
	@MY_UID=$$(id -u) MY_GID=$$(id -g) docker compose -f docker-compose.dev.yml up

prod:
	@docker compose -f docker-compose.prod.yml up

down:
	@docker compose -f docker-compose.dev.yml down

stop:
	@docker compose -f docker-compose.dev.yml stop

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
