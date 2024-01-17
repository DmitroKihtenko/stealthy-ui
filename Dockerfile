FROM node:20.0.0-alpine AS builder
WORKDIR /app
COPY package*.json angular.json tsconfig*.json ./
RUN npm install
COPY src ./src
RUN ./node_modules/.bin/ng build

FROM nginx:1.25.3-alpine as application
COPY --from=builder /app/dist/stealthy-ui/browser /usr/share/nginx/html
COPY ./build/default.conf /etc/nginx/conf.d/
