FROM node:20-alpine AS builder

WORKDIR /authentication

# Copy only package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build:prod

FROM node:20-alpine
WORKDIR /authentication

# Copy only the necessary files from the builder stage
COPY --from=builder /authentication/dist ./dist
COPY --from=builder /authentication/node_modules ./node_modules
COPY package*.json ./

EXPOSE 4001 8001
CMD ["npm", "run", "start:dev"]