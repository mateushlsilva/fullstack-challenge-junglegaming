FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/api-gateway

ENV NODE_ENV=development
ENV PORT=3001
ENV RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
