# ProSphere

## Project Overview
A modern microservices-based application consisting of three main services: Authentication, Feed, and UI, designed to demonstrate scalable and maintainable microservices architecture.

## System Architecture
```mermaid
graph TB
    Client[Client Browser]
    Gateway[API Gateway]
    Auth[Authentication Service]
    Feed[Feed Service]
    UI[UI Service]
    AuthDB[(MySQL Auth DB)]
    FeedDB[(MySQL Feed DB)]
    Redis[(Redis Cache)]
    RMQ[RabbitMQ]
    Jaeger[Jaeger Tracing]

    Client --> Gateway
    Gateway --> Auth
    Gateway --> Feed
    Gateway --> UI
    
    Auth --> AuthDB
    Auth --> Redis
    Auth --> RMQ
    
    Feed --> FeedDB
    Feed --> RMQ
    Feed --> Redis
    
    UI --> Auth
    UI --> Feed
    
    Auth -.-> Jaeger
    Feed -.-> Jaeger
    UI -.-> Jaeger

    classDef service fill:#68b587,stroke:#333,stroke-width:2px;
    classDef database fill:#3498db,stroke:#333,stroke-width:2px;
    classDef messagequeue fill:#e74c3c,stroke:#333,stroke-width:2px;
    classDef monitoring fill:#f1c40f,stroke:#333,stroke-width:2px;
    
    class Auth,Feed,UI service;
    class AuthDB,FeedDB,Redis database;
    class RMQ messagequeue;
    class Jaeger monitoring;
```

## Architecture Overview

### 1. Authentication Service (Port: 4001, 8001)
- **Purpose**: Handles user authentication and authorization
- **Features**:
  - User registration and login
  - JWT token management
  - OAuth2 integration
  - Password encryption and management
- **Tech Stack**:
  - NestJS (Backend)
  - MySQL (Database)
  - Redis (Caching)
  - JWT (Authentication)
  - RabbitMQ (Message Queue)

### 2. Feed Service (Port: 4002, 8002)
- **Purpose**: Manages content feeds and user interactions
- **Features**:
  - Content aggregation and delivery
  - Real-time feed updates
  - User interaction tracking
  - Personalized content delivery
- **Tech Stack**:
  - NestJS
  - MySQL
  - RabbitMQ
  - Redis

### 3. UI Service (Port: 4003)
- **Purpose**: Frontend application
- **Features**:
  - Responsive design
  - Module federation
  - Real-time updates
  - Integrated authentication
- **Tech Stack**:
  - React.js
  - Module Federation
  - Webpack

## Prerequisites
- Docker and Docker Compose
- Node.js (v20+)
- npm or yarn
- Git

## Getting Started

### 1. Clone the Repository
```bash
cd example-microservices
```

```bash
$ docker-compose up -d
```

