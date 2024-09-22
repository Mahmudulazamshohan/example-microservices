import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOperationOptions,
  ApiHeader,
  ApiHeaderOptions,
  ApiQueryOptions,
  ApiResponseOptions,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { removeProperties } from '../utils';

interface ApiSwaggerOptions extends ApiOperationOptions {
  headers?: ApiHeaderOptions[];
  authentication?: boolean;
  query?: ApiQueryOptions;
  response?: ApiResponseOptions;
  tags?: string[];
}

export function ApiSwagger(options: ApiSwaggerOptions) {
  const opt: ApiSwaggerOptions = {
    authentication: true,
    ...options,
  };

  const decorators = [
    ApiOperation({
      summary: opt.summary || `${opt.operationId}`,
      description: opt.description || `${opt.operationId}`,
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

  if (opt?.query) {
    decorators.push(ApiBody(opt.query));
  }

  if (opt?.response) {
    decorators.push(ApiResponse(opt.response));
  }

  if (opt?.tags) {
    decorators.push(ApiTags(...opt.tags));
  }

  return applyDecorators(...decorators);
}
