# UI Service

## Overview

The UI Service is the frontend component of the Example Microservices application. It provides a unified user interface that integrates with the Authentication and Feed microservices using Module Federation.

## Features

- Single Page Application (SPA) built with React
- Module Federation for micro-frontend architecture
- Authentication and authorization flows
- Feed display and interaction
- Responsive design with Material UI
- Server-side rendering support

## Architecture

The UI Service follows a micro-frontend architecture pattern, leveraging Webpack Module Federation to dynamically load components from other services.

### UI Architecture

```mermaid
graph TD
    Client[Client Browser] --> UI[UI Service]
    UI --> AuthUI[Authentication UI Module]
    UI --> FeedUI[Feed UI Module]
    
    AuthUI --> AuthAPI[Authentication API]
    FeedUI --> FeedAPI[Feed API]
    
    subgraph "Frontend Components"
        UI
        AuthUI
        FeedUI
    end
    
    subgraph "Backend Services"
        AuthAPI
        FeedAPI
    end
    
    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style AuthUI fill:#bbf,stroke:#333,stroke-width:1px
    style FeedUI fill:#bbf,stroke:#333,stroke-width:1px