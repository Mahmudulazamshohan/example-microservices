# Authentication Service

## Overview

The Authentication Service is a microservice component of the Example Microservices application. It handles user authentication, authorization, and user management functionality.

## Features

- User registration and management
- Authentication with JWT
- Refresh token mechanism
- Role-based access control
- Secure password hashing with bcrypt
- Integration with other services via RabbitMQ

## Architecture

The Authentication Service follows a microservice architecture pattern, communicating with other services through message queues and RESTful APIs.

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Auth as Authentication Service
    participant DB as Auth Database
    participant Redis as Redis Cache
    participant MQ as RabbitMQ

    Client->>Gateway: Login Request
    Gateway->>Auth: Forward Request
    Auth->>DB: Validate Credentials
    DB-->>Auth: User Data
    
    alt Valid Credentials
        Auth->>Auth: Generate JWT & Refresh Token
        Auth->>Redis: Cache Token
        Auth->>DB: Update Last Login
        Auth->>MQ: Publish Login Event
        Auth-->>Gateway: Return Tokens
        Gateway-->>Client: Authentication Success
    else Invalid Credentials
        Auth-->>Gateway: Authentication Failed
        Gateway-->>Client: Error Response
    end
    
    Note over Client,Auth: Later - Token Refresh
    
    Client->>Gateway: Refresh Token Request
    Gateway->>Auth: Forward Request
    Auth->>DB: Validate Refresh Token
    DB-->>Auth: Token Valid
    Auth->>Auth: Generate New Tokens
    Auth->>DB: Update Refresh Token
    Auth-->>Gateway: Return New Tokens
    Gateway-->>Client: New Tokens
```
## Tech Stack

- NestJS framework
- TypeORM for database interactions
- MySQL database
- RabbitMQ for inter-service communication
- Redis for caching
- Docker for containerization
- Swagger for API documentation

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn

## Environment Variables

The service uses the following environment variables: