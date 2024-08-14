# Use an official Node.js runtime as a parent image
FROM node:18-alpine as builder

WORKDIR /authentication
RUN apk --no-cache add --virtual builds-deps build-base python3

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001

CMD ["npm","run", "start:dev"]