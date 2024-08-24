FROM node:20-alpine AS backend-builder
WORKDIR /feed
COPY package*.json ./
RUN npm install --omit=dev
RUN npm install -g @nestjs/cli
COPY . .
RUN npm run build:prod
RUN npm uninstall -g @nestjs/cli


FROM node:20-alpine AS ui-builder
WORKDIR /ui
COPY package*.json ./
COPY --from=backend-builder /feed/node_modules ./node_modules
RUN npm install --save-dev webpack
COPY . .
RUN npm run webpack:prod
RUN npm uninstall --save-dev webpack

FROM node:20-alpine
WORKDIR /feed
COPY --from=backend-builder /feed/dist ./dist
COPY --from=backend-builder /feed/node_modules ./node_modules
COPY --from=backend-builder /feed/package*.json ./
COPY --from=ui-builder /ui/dist/public ./dist/public

EXPOSE 4002

CMD node --max_old_space_size=512 dist/main
