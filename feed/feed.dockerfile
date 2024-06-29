# Use an official Node.js runtime as a parent image
FROM node:18-alpine

WORKDIR /usr/src/feed
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4002
CMD ["npm","run", "start:dev"]