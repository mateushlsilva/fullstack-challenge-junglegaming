FROM node:alpine AS base
WORKDIR /app


COPY package.json ./
COPY package-lock.json ./
COPY packages ./packages
COPY apps ./apps


RUN npm install

FROM base AS development

WORKDIR /app/apps/notifications-service

ENV NODE_ENV=development

EXPOSE 3004

CMD ["npm", "run", "start:dev"]



FROM base AS build

WORKDIR /app/apps/notifications-service

ENV NODE_ENV=production

RUN npm run build



FROM node:alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/apps/notifications-service/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY apps/notifications-service/package.json ./

EXPOSE 3004

CMD ["node", "apps/notifications-service/dist/main.js"]

