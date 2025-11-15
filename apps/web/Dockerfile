FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

WORKDIR /app/apps/web

ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
