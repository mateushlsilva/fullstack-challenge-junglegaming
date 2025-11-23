FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/api-gateway

ENV NODE_ENV=development

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
