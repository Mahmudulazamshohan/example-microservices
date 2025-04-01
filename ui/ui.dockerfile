FROM node:20-alpine AS ui-builder
WORKDIR /ui
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm install --save-dev webpack
RUN npm run build:webpack
RUN npm run build:prod

FROM node:20-alpine
WORKDIR /ui
COPY --from=ui-builder /ui/dist ./dist
COPY --from=ui-builder /ui/node_modules ./node_modules
COPY --from=ui-builder /ui/package*.json ./
COPY --from=ui-builder /ui/app.js ./

EXPOSE 4003

CMD node --max_old_space_size=512 app
