## Description
Microservice Architecture Overview
An application composed of multiple independent services: Authentication, Feed, and UI.

1. Authentication Service
Purpose: Handles user authentication and authorization.

Key Features:

User Registration and Login
JWT Token Generation
Authorization
Password Management
Tech Stack: NestJS, MYSQL, JWT, OAuth2

2. Feed Service
Purpose: Manages and delivers personalized content feeds.

Key Features:

Content Aggregation
User Personalization
Real-time Feed Updates
Interaction Tracking
Tech Stack: Node.js, Redis, RabbitMQ

3. UI Service
Purpose: Provides the frontend interface for user interactions.

Key Features:

Responsive Design
API Integration
User Interface Rendering
Real-time Updates
Tech Stack: React.js, Axios/Fetch API
## Installation

```bash
$ docker-compose up -d
```

