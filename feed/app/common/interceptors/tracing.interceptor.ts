// src/shared/tracing.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { trace, context, propagation, Span } from '@opentelemetry/api';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const contextType = executionContext.getType();
    let span: Span;

    if (contextType === 'http') {
      const httpContext = executionContext.switchToHttp();
      const request = httpContext.getRequest();

      // Extract parent context from HTTP headers
      const parentContext = propagation.extract(
        context.active(),
        request.headers,
      );
      const tracer = trace.getTracer('http');

      span = tracer.startSpan(
        `HTTP ${request.method} ${request.path}`,
        {
          attributes: {
            'http.method': request.method,
            'http.url': request.url,
            'http.target': request.path,
            'http.host': request.headers.host,
            'http.scheme': 'http',
            'http.user_agent': request.headers['user-agent'],
          },
        },
        parentContext,
      );
    } else if (contextType === 'rpc') {
      const rpcContext = executionContext.switchToRpc();
      const { headers } = rpcContext.getData() as {
        headers: Record<string, string>;
        data: unknown;
      };

      // Extract parent context from RabbitMQ headers
      const parentContext = propagation.extract(context.active(), headers);
      const tracer = trace.getTracer('rabbitmq');

      span = tracer.startSpan(
        'rabbitmq.process',
        { attributes: { 'messaging.system': 'rabbitmq' } },
        parentContext,
      );
    } else {
      return next.handle();
    }

    // Set the span in context and handle the request
    return context.with(trace.setSpan(context.active(), span), () => {
      return next.handle().pipe(
        tap(() => span?.end()),
        tap({
          error: (err) => {
            span?.setAttribute('error', true);
            span?.recordException(err);
          },
        }),
      );
    });
  }
}
