import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse, IJsObject } from '../interfaces/types';

export class ApiResponse implements IApiResponse {
  data = null;

  constructor(partial: IJsObject) {
    if (partial?.metadata) {
      Object.assign(this, {
        metadata: partial.metadata,
      });
    }
    if (partial) {
      Object.assign(this, {
        data: partial,
      });
    }
  }
  status: string;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => new ApiResponse(data)));
  }
}
