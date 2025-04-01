import { HttpStatus } from '@nestjs/common';
import type { Params } from 'nestjs-pino';
import { multistream } from 'pino';

export const IGNORED_ROUTES = new Set(['/health', '/favicon.ico']);

export const loggerOptions: Params = {
  pinoHttp: [
    {
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : {
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
          }),
      autoLogging: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ignore: (req) => IGNORED_ROUTES.has((<any>req).originalUrl),
      },
      formatters: {
        level: (label: string) => {
          return { level: label };
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customLogLevel: function (res: any, _: unknown, err) {
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
