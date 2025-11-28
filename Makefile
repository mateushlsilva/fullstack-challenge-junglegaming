env:
	@echo "Criando arquivos .env genéricos..."
	@cat << EOF > ./apps/api-gateway/.env
	PORT=3001
	RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
	AUTH_URL_HEALTH=http://auth-service:3002/health
	TASKS_URL_HEALTH=http://tasks-service:3003/health
	NOTIFICATIONS_URL_HEALTH=http://notifications-service:3004/health
	JWT_ACCESS_SECRET=sua_secret_access
	JWT_REFRESH_SECRET=sua_secret_refresh

	EOF

	@cat << EOF > ./apps/auth-service/.env
	PORT=3002
	RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
	DB_HOST=db
	DB_PORT=5432
	DB_USERNAME=postgres
	DB_PASSWORD=password
	DB_NAME=challenge_db
	JWT_ACCESS_SECRET=sua_secret_access
	JWT_REFRESH_SECRET=sua_secret_refresh

	EOF

	@cat << EOF > ./apps/notifications-service/.env
	PORT=3004
	RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
	DB_HOST=db
	DB_PORT=5432
	DB_USERNAME=postgres
	DB_PASSWORD=password
	DB_NAME=challenge_db
	GATEWAY_WS_URL=ws://localhost:3001

	EOF

	@cat << EOF > ./apps/tasks-service/.env
	PORT=3003
	RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
	DB_HOST=db
	DB_PORT=5432
	DB_USERNAME=postgres
	DB_PASSWORD=password
	DB_NAME=challenge_db

	EOF

	@cat << EOF > ./apps/web/.env
	VITE_API_URL=http://localhost:3001
	VITE_WS_URL=ws://localhost:3001

	EOF

run:
	@sudo docker compose up --build

stop:
	@sudo docker compose down

