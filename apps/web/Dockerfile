FROM node:alpine AS base
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY packages ./packages
COPY apps ./apps

RUN npm install


FROM base AS development

WORKDIR /app/apps/web

ENV NODE_ENV=development

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]



FROM base AS build

WORKDIR /app/apps/web

ENV NODE_ENV=production

RUN npm run build


FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html


RUN rm -rf ./*


COPY --from=build /app/apps/web/dist ./


COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
