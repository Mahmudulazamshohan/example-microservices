# build stage
FROM node:lts-alpine as dev-stage

WORKDIR /feed

COPY package*.json ./
RUN npm install

COPY ./ .

CMD npm run start:dev

EXPOSE 4002 8002