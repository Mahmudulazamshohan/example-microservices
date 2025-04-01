import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse, IJsObject } from '../interfaces/types';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> implements IApiResponse<T> {
  @ApiProperty({
    description: 'Metadata related to the response',
    required: false,
  })
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'The actual data of the response',
    required: false,
  })
  data?: T;

  @ApiProperty({ description: 'The status of the response' })
  status: string;

  @ApiProperty({ description: 'Message describing the response' })
  message: string;

  @ApiProperty({ description: 'List of errors if any', required: false })
  errors?: string[];

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
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(map((data: any) => new ApiResponse(data)));
  }
}
