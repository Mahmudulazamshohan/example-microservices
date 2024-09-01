FROM node:18

WORKDIR /authentication
RUN apt-get update && apt-get install -y python3 g++ make

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001 8001
CMD npm run start:dev