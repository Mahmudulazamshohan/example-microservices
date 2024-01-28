import { HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Params } from 'nestjs-pino';
import { multistream } from 'pino';

export const IGNORED_ROUTES = new Set(['/health', '/favicon.ico']);

export const loggerOptions: Params = {
  pinoHttp: [
    {
      ...(process.env.NODE_ENV === 'development'
        ? {
            level: 'debug',
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                colorizeObjects: true,
                ignore: 'req.headers,res.headers',
              },
            },
          }
        : {}),
      autoLogging: {
        ignore: (req) => IGNORED_ROUTES.has((<Request>req).originalUrl),
      },
      formatters: {
        level: (label: string) => {
          return { level: label };
        },
      },
      customLogLevel: function (_: Request, res: Response, err) {
        if (res.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
          return 'error';
        } else if (res.statusCode >= HttpStatus.BAD_REQUEST || err) {
          return 'warn';
        }

        return 'info';
      },
    },
    multistream(
      [
        { level: 'info', stream: process.stdout },
        { level: 'debug', stream: process.stdout },
        { level: 'warn', stream: process.stderr },
        { level: 'error', stream: process.stderr },
        { level: 'fatal', stream: process.stderr },
      ],
      { dedupe: true },
    ),
  ],
};
