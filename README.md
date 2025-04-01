# ProSphere

## Project Overview
A modern microservices-based application consisting of three main services: Authentication, Feed, and UI, designed to demonstrate scalable and maintainable microservices architecture.

## System Architecture
```mermaid
graph TB
    subgraph Kubernetes Cluster
        INGN[Nginx Ingress Controller]
        
        subgraph UI Service
            UI[UI Pod]
            UISVC[UI Service]
        end
        
        subgraph Authentication Service
            AUTH[Authentication Pod]
            AUTHSVC[Auth Service]
            AUTHDB[(MySQL)]
            AUTHREDIS[(Redis)]
        end
        
        subgraph Feed Service
            FEED[Feed Pod]
            FEEDSVC[Feed Service]
            FEEDDB[(MySQL)]
        end
        
        subgraph Message Broker
            RMQ[RabbitMQ]
        end
        
        subgraph Observability
            JAEGER[Jaeger]
        end
    end
    
    Client[External Client] --> INGN
    INGN --> UISVC
    UISVC --> UI
    
    UI --> AUTHSVC
    UI --> FEEDSVC
    
    AUTHSVC --> AUTH
    AUTH --> AUTHDB
    AUTH --> AUTHREDIS
    AUTH --> RMQ
    
    FEEDSVC --> FEED
    FEED --> FEEDDB
    FEED --> RMQ
    
    AUTH -.-> JAEGER
    FEED -.-> JAEGER
    UI -.-> JAEGER

    classDef client fill:#85C1E9,stroke:#333,stroke-width:2px;
    classDef ingress fill:#F8C471,stroke:#333,stroke-width:2px;
    classDef service fill:#82E0AA,stroke:#333,stroke-width:2px;
    classDef pod fill:#85C1E9,stroke:#333,stroke-width:2px;
    classDef database fill:#BB8FCE,stroke:#333,stroke-width:2px;
    classDef broker fill:#F1948A,stroke:#333,stroke-width:2px;
    classDef monitoring fill:#F7DC6F,stroke:#333,stroke-width:2px;
    
    class Client client;
    class INGN ingress;
    class UISVC,AUTHSVC,FEEDSVC service;
    class UI,AUTH,FEED pod;
    class AUTHDB,FEEDDB,AUTHREDIS database;
    class RMQ broker;
    class JAEGER monitoring;
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

