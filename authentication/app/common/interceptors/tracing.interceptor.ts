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
    if (executionContext.getType() !== 'rpc') return next.handle();

    const rpcContext = executionContext.switchToRpc();
    const { headers } = rpcContext.getData() as {
      headers: Record<string, string>;
      data: unknown;
    };

    const parentContext = propagation.extract(context.active(), headers);
    const tracer = trace.getTracer('rabbitmq');
    const span: Span = tracer.startSpan(
      'rabbitmq.process',
      { attributes: { 'messaging.system': 'rabbitmq' } },
      parentContext,
    );

    // Attach span to the current context
    return next.handle().pipe(
      tap(() => span.end()),
      tap({ error: (err) => span.recordException(err) }),
    );
  }
}
