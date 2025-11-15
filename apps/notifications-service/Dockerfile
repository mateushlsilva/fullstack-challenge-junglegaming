FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/notifications-service

ENV NODE_ENV=development
ENV PORT=3004
ENV RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672

EXPOSE 3004

CMD ["npm", "run", "start:dev"]