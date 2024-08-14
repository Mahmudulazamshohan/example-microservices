import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOperationOptions,
  ApiHeader,
  ApiHeaderOptions,
} from '@nestjs/swagger';
import { removeProperties } from '../utils';

interface ApiSwaggerOptions extends ApiOperationOptions {
  headers?: ApiHeaderOptions[];
  authentication?: boolean;
}

export function ApiSwagger(options: ApiSwaggerOptions) {
  const opt: ApiSwaggerOptions = {
    authentication: true,
    ...options,
  };

  const decorators = [
    ApiOperation({
      summary: opt.summary || `${opt.operationId}`,
      description: opt.description || 'Default description',
      ...removeProperties(options, ['authentication']),
    }),
  ];
  const headers = [...(opt.headers ?? [])];

  if (opt?.authentication) {
    headers.push({
      name: 'Authorization',
      description: 'Access token',
      required: true,
    });
  }
  if (headers) {
    headers.forEach((header) => {
      decorators.push(ApiHeader(header));
    });
  }

  return applyDecorators(...decorators);
}
