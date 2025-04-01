import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Response } from 'express';

import { IApiResponse, IJsObject } from '../interfaces/types';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: unknown = exception?.message || 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const excetionResp: string | IJsObject = exception.getResponse();
      if (typeof excetionResp === 'string') {
        message = excetionResp;
      } else if (typeof excetionResp === 'object') {
        message = excetionResp?.message;
      }
    }

    const resp: IApiResponse = {
      ...(Array.isArray(message) && { errors: message }),
      status: 'error',
      message: exception?.message,
    };

    this.logger.error(
      exception,
      exception?.stack || '',
      CommonExceptionFilter.name,
    );

    return response.status(status).json(resp);
  }
}
