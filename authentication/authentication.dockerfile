FROM node:18-alpine AS builder

WORKDIR /authentication

COPY package*.json ./

RUN npm install --omit=dev

RUN npm install -g @nestjs/cli

COPY . .


RUN npm run build


FROM node:18-alpine

WORKDIR /authentication

COPY --from=builder /authentication/dist ./dist
COPY --from=builder /authentication/node_modules ./node_modules
COPY --from=builder /authentication/package*.json ./

COPY .env ./dist

EXPOSE 4001

CMD node --max_old_space_size=512 dist/main
