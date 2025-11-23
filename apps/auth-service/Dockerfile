FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/auth-service

ENV NODE_ENV=development

EXPOSE 3002

CMD ["npm", "run", "start:dev"]