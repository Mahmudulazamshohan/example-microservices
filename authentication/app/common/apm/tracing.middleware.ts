import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { trace, context } from '@opentelemetry/api';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('http-middleware');

    const span = tracer.startSpan('http_request');
    span.setAttribute('http.method', req.method);
    span.setAttribute('http.url', req.url);
    span.setAttribute('http.route', req.route?.path);

    context.with(trace.setSpan(context.active(), span), () => {
      res.on('finish', () => {
        span.setAttribute('http.status_code', res.statusCode);
        span.end();
      });
      next();
    });
  }
}
