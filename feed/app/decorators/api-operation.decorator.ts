import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOperationOptions,
  ApiHeader,
  ApiHeaderOptions,
  ApiQueryOptions,
  // ApiResponseOptions,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { removeProperties } from '../utils';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface ApiSwaggerOptions extends ApiOperationOptions {
  headers?: ApiHeaderOptions[];
  auth?: boolean;
  query?: ApiQueryOptions | unknown;
  response?: {
    type?: any;
    isArray?: boolean;
    status?: number;
    description?: string;
  };
  tags?: string[];
}

export function ApiSwagger(options: ApiSwaggerOptions) {
  const opt: ApiSwaggerOptions = {
    auth: true,
    ...options,
  };

  const decorators = [
    ApiOperation({
      summary: opt.summary || `${opt.operationId}`,
      description: opt.description || `${opt.operationId}`,
      ...removeProperties(options, ['auth']),
    }),
  ];
  const headers = [...(opt.headers ?? [])];

  if (opt?.auth) {
    // headers.push({
    //   name: 'Authorization',
    //   description: 'Access token',
    //   required: true,
    // });
    decorators.push(ApiBearerAuth());
  }
  if (headers) {
    headers.forEach((header) => {
      decorators.push(ApiHeader(header));
    });
  }

  if (opt?.query) {
    // Check if query is a class/DTO
    if (typeof opt.query === 'function') {
      decorators.push(
        ApiBody({
          type: opt.query,
          description: 'Query parameters',
        }),
      );
    } else {
      decorators.push(ApiBody(opt.query));
    }
  }

  if (opt?.response) {
    const responseType = opt.response.type;
    const schema: SchemaObject = {
      type: 'object',
      properties: {
        metadata: {
          type: 'object',
          description: 'Metadata related to the response',
        },
        data: responseType
          ? {
              ...(opt.response.isArray
                ? {
                    type: 'array',
                    items: {
                      $ref: `#/components/schemas/${responseType?.name}`,
                    },
                  }
                : {
                    $ref: `#/components/schemas/${responseType?.name}`,
                  }),
            }
          : {
              type: 'object',
              description: 'The actual data of the response',
            },
        status: {
          type: 'string',
          description: 'The status of the response',
        },
        message: {
          type: 'string',
          description: 'Message describing the response',
        },
        errors: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of errors if any',
        },
      },
      required: ['status', 'message'],
    };

    decorators.push(
      ApiResponse({
        status: opt.response.status || 200,
        description: opt.response.description || '',
        schema,
      }),
    );
  }

  if (opt?.tags) {
    decorators.push(ApiTags(...opt.tags));
  }

  return applyDecorators(...decorators);
}
