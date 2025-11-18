FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/tasks-service

ENV NODE_ENV=development
ENV PORT=3003
ENV RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=postgres

EXPOSE 3003

CMD ["npm", "run", "start:dev"]