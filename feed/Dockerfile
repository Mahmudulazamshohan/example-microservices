FROM node:20-alpine AS builder

WORKDIR /feed

# Copy only package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build:prod

FROM node:20-alpine
WORKDIR /feed

# Copy only the necessary files from the builder stage
COPY --from=builder /feed/dist ./dist
COPY --from=builder /feed/node_modules ./node_modules
COPY package*.json ./

EXPOSE 4001 8001
CMD ["npm", "run", "start:dev"]