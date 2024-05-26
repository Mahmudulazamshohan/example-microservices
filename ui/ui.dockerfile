# Use an official Node.js runtime as a parent image
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 4003
CMD ["npm", "start"]