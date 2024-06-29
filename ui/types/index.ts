import { NextFunction, Request, Response } from "express";

export interface Host {
    replacements: object;
    hostOverride: string;
};

export type Headers = object;

export type Asset = {
    paths: string[];
    cdn: string[];
    local: string[];
};

export type Middleware =((req: Request, res: Response, next: NextFunction) => void);

export type SVC = {
    serviceName: string;
    branch: string;
    host: Host;
    paths: string[],
    rewritePath: (request: Request) => string;
    headers: Headers;
    isAuthenticated: boolean;
    timeout: number;
    hasLayout: boolean;
    assets: Asset[],
    middlewares: Middleware[];
};