# build stage
FROM node:lts-alpine as dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN rm /usr/lib/python3.11/EXTERNALLY-MANAGED
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
CMD npm run start
EXPOSE 4002