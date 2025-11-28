gateway:
	@echo "PORT=3001" > ./apps/api-gateway/.env
	@echo "RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672" >> ./apps/api-gateway/.env
	@echo "AUTH_URL_HEALTH=http://auth-service:3002/health" >> ./apps/api-gateway/.env
	@echo "TASKS_URL_HEALTH=http://tasks-service:3003/health" >> ./apps/api-gateway/.env
	@echo "NOTIFICATIONS_URL_HEALTH=http://notifications-service:3004/health" >> ./apps/api-gateway/.env
	@echo "JWT_ACCESS_SECRET=sua_secret_access" >> ./apps/api-gateway/.env
	@echo "JWT_REFRESH_SECRET=sua_secret_refresh" >> ./apps/api-gateway/.env

auth:
	@echo "PORT=3002" > ./apps/auth-service/.env
	@echo "RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672" >> ./apps/auth-service/.env
	@echo "DB_HOST=db" >> ./apps/auth-service/.env
	@echo "DB_PORT=5432" >> ./apps/auth-service/.env
	@echo "DB_USERNAME=postgres" >> ./apps/auth-service/.env
	@echo "DB_PASSWORD=password" >> ./apps/auth-service/.env
	@echo "DB_NAME=challenge_db" >> ./apps/auth-service/.env
	@echo "JWT_ACCESS_SECRET=sua_secret_access" >> ./apps/auth-service/.env
	@echo "JWT_REFRESH_SECRET=sua_secret_refresh" >> ./apps/auth-service/.env

notifications:
	@echo "PORT=3004" > ./apps/notifications-service/.env
	@echo "RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672" >> ./apps/notifications-service/.env
	@echo "DB_HOST=db" >> ./apps/notifications-service/.env
	@echo "DB_PORT=5432" >> ./apps/notifications-service/.env
	@echo "DB_USERNAME=postgres" >> ./apps/notifications-service/.env
	@echo "DB_PASSWORD=password" >> ./apps/notifications-service/.env
	@echo "DB_NAME=challenge_db" >> ./apps/notifications-service/.env
	@echo "GATEWAY_WS_URL=ws://localhost:3001" >> ./apps/notifications-service/.env

tasks:
	@echo "PORT=3003" > ./apps/tasks-service/.env
	@echo "RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672" >> ./apps/tasks-service/.env
	@echo "DB_HOST=db" >> ./apps/tasks-service/.env
	@echo "DB_PORT=5432" >> ./apps/tasks-service/.env
	@echo "DB_USERNAME=postgres" >> ./apps/tasks-service/.env
	@echo "DB_PASSWORD=password" >> ./apps/tasks-service/.env
	@echo "DB_NAME=challenge_db" >> ./apps/tasks-service/.env

web:
	@echo "VITE_API_URL=http://localhost:3001" > ./apps/web/.env
	@echo "VITE_WS_URL=/socket.io" >> ./apps/web/.env

env: gateway auth notifications tasks web
	@echo "Criando arquivos .env genéricos..."

run:
	@sudo docker compose up --build

stop:
	@sudo docker compose down

