FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/auth-service

ENV NODE_ENV=development
ENV PORT=3002
ENV RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672

EXPOSE 3002

CMD ["npm", "run", "start:dev"]