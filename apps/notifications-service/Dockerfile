FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/notifications-service

ENV NODE_ENV=development

EXPOSE 3004

CMD ["npm", "run", "start:dev"]