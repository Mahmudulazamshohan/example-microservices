import { Request } from "express";
import { SVC } from "../types";

const SERVICE_NAME: string = 'ui';

export default {
    serviceName: SERVICE_NAME,
    branch: 'main',
    host: {
        replacements: {
            SERVICE_NAME,
            DOCKER_COMPOSE_PORT: 8078,
            PORT: 8080,
        },
        hostOverride: process.env.RECRUITMENTS_MICROSERVICE_URL || '',
    },
    paths: ['/'],
    rewritePath: (request: Request) => {
        return '';
    },
    headers: {
        value: 1,
    },
    isAuthenticated: true,
    timeout: 30 * 1000,
    hasLayout: true,
    assets: [
        {
            paths: [],
            cdn: [],
            local: ['http://localhost:4003/main.js'],
        },
    ],
    middlewares: [
        (req, res, next) => {
            res.header({
                'Authorization':'Bearer asdasd'
            });
            next();
        }
    ],
} as SVC;