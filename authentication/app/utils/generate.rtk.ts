import { OpenAPIObject } from '@nestjs/swagger';
import { format } from 'prettier';

interface OpenApiSchema {
  type: string;
  properties?: Record<string, { type: string; description?: string }>;
  required?: string[];
}

interface OpenApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  schema: OpenApiSchema;
}

interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  parameters?: OpenApiParameter[];
  requestBody?: {
    content: {
      [key: string]: {
        schema: {
          $ref: string;
        };
      };
    };
  };
}

interface OpenApiPaths {
  [path: string]: {
    [method: string]: OpenApiOperation;
  };
}

interface OpenApiComponents {
  schemas: {
    [name: string]: OpenApiSchema;
  };
}

interface OpenApiDocument extends OpenAPIObject {
  paths: OpenApiPaths;
  components: OpenApiComponents;
  servers?: Array<{ url: string }>;
}

export class RtkApiGenerator {
  private tsCode: string = '';
  private readonly baseUrl: string;
  private endpointTypes: string[] = [];

  constructor(private readonly openApiJson: OpenApiDocument) {
    this.baseUrl = openApiJson.servers?.[0]?.url || '';
  }

  public async generate(): Promise<string> {
    this.addImports();
    this.generateSchemas();
    this.generateBaseApi();
    this.generateEndpoints();
    this.finalizeApiSlice();

    return format(this.tsCode, {
      parser: 'typescript',
      singleQuote: true,
    });
  }

  private addImports(): void {
    this.tsCode += `
    import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
    import { SecureStorage } from '../storage/secureStorage';
    import { TOKEN } from '../shared/types';

    // Custom axios-based baseQuery with token handling
    import axios, { AxiosRequestConfig, AxiosError } from 'axios';
    
    const axiosBaseQuery = ({ baseUrl }: { baseUrl: string }) => 
      async ({ url, method, data, params, headers }: {
        url: string;
        method: string;
        data?: any;
        params?: any;
        headers?: any;
      }) => {
        try {
          const token = SecureStorage.getItem(TOKEN.ACCESS_TOKEN);
          const result = await axios({
            url: baseUrl + url,
            method,
            data,
            params,
            headers: {
              ...headers,
              ...(token ? { Authorization: \`Bearer \${token}\` } : {})
            }
          });
          return { data: result.data };
        } catch (axiosError) {
          const err = axiosError as AxiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message
            }
          };
        }
      };\n\n`;
  }

  private generateSchemas(): void {
    const { schemas } = this.openApiJson.components;

    this.tsCode += '// Type definitions for schemas\n';
    for (const [schemaName, schema] of Object.entries(schemas)) {
      this.tsCode += `export interface ${schemaName} {\n`;
      if (schema.properties) {
        const requiredFields = schema.required || [];
        for (const [propName, propDetails] of Object.entries(
          schema.properties,
        )) {
          const isRequired = requiredFields.includes(propName);
          const propType = this.mapType(propDetails.type);
          this.tsCode += `  ${propName}${isRequired ? '' : '?'}: ${propType}; ${
            propDetails.description ? `// ${propDetails.description}` : ''
          }\n`;
        }
      }
      this.tsCode += '}\n\n';
    }
  }

  private generateBaseApi(): void {
    this.tsCode += `
    // Define response type for API
    export interface ApiResponse<T = any> {
      data: T;
      message: string;
      statusCode: number;
    }
    
    // Create the base API with token refresh logic
    export const baseApi = createApi({
      reducerPath: 'api',
      baseQuery: axiosBaseQuery({
        baseUrl: '${this.baseUrl}',
      }),
      endpoints: () => ({}),
      tagTypes: ['Posts', 'Comments', 'Connections', 'Likes'],
    });\n\n`;
  }

  private generateEndpoints(): void {
    const { paths } = this.openApiJson;

    // Group endpoints by feature
    const featureGroups: Record<
      string,
      Array<{
        path: string;
        method: string;
        operation: OpenApiOperation;
      }>
    > = {};

    // First pass - group operations by feature
    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        const operationId =
          operation.operationId ||
          this.generateDefaultOperationId(method, path, operation.summary);

        // Extract feature name from path or operationId
        const feature = this.extractFeatureName(path, operationId);

        if (!featureGroups[feature]) {
          featureGroups[feature] = [];
        }

        featureGroups[feature].push({
          path,
          method,
          operation: {
            ...operation,
            operationId: operationId,
          },
        });
      }
    }

    // Second pass - generate API slices for each feature
    for (const [feature, operations] of Object.entries(featureGroups)) {
      this.generateApiSlice(feature, operations);
    }
  }

  private extractFeatureName(path: string, operationId: string): string {
    // Try to extract feature from path first
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      return pathParts[0].toLowerCase();
    }

    // Fall back to operationId
    const parts = operationId.split('_');
    if (parts.length > 0) {
      return parts[0].toLowerCase();
    }

    return 'common';
  }

  private generateApiSlice(
    feature: string,
    operations: Array<{
      path: string;
      method: string;
      operation: OpenApiOperation;
    }>,
  ): void {
    this.tsCode += `// ${feature} API slice\n`;
    this.tsCode += `export const ${feature}Api = baseApi.injectEndpoints({\n`;
    this.tsCode += `  endpoints: (builder) => ({\n`;

    for (const { path, method, operation } of operations) {
      this.generateEndpoint(feature, path, method, operation);
    }

    this.tsCode += `  }),\n`;
    this.tsCode += `  overrideExisting: false,\n`;
    this.tsCode += `});\n\n`;

    // Export hooks
    this.tsCode += `export const {\n`;
    this.tsCode += this.endpointTypes.join(',\n');
    this.tsCode += `\n} = ${feature}Api;\n\n`;

    // Clear endpoint types for next feature
    this.endpointTypes = [];
  }

  private generateEndpoint(
    feature: string,
    path: string,
    method: string,
    operation: OpenApiOperation,
  ): void {
    const operationId = operation.operationId!;
    const parameters = operation.parameters || [];
    const requestBody = operation.requestBody;

    // Determine if this is a query or mutation
    const isQuery = ['get'].includes(method.toLowerCase());
    const builderMethod = isQuery ? 'query' : 'mutation';

    // Generate endpoint name
    const endpointName = this.camelCase(operationId.replace(`${feature}_`, ''));

    // Start endpoint definition
    this.tsCode += `    ${endpointName}: builder.${builderMethod}<`;

    // Determine response type
    this.tsCode += `ApiResponse`;

    // Determine request type
    let requestType = 'void';
    const requestParams: string[] = [];

    // Path parameters
    parameters.forEach((param) => {
      if (param.in === 'path' || param.in === 'query') {
        requestParams.push(
          `${param.name}${param.required ? '' : '?'}: ${this.mapType(param.schema.type)}`,
        );
      }
    });

    // Request body
    if (requestBody?.content['application/json']?.schema?.$ref) {
      const schemaName = requestBody.content['application/json'].schema.$ref
        .split('/')
        .pop();
      requestParams.push(`body: ${schemaName}`);
    }

    if (requestParams.length > 0) {
      requestType = `{ ${requestParams.join('; ')} }`;
    }

    this.tsCode += `, ${requestType}>((`;

    // Parameter name for the endpoint function
    const paramName = requestParams.length > 0 ? 'args' : '_';
    this.tsCode += `${paramName}) => ({\n`;

    // URL with path parameters
    this.tsCode += `      url: \`${this.formatPath(path)}\`,\n`;
    this.tsCode += `      method: '${method.toLowerCase()}',\n`;

    // Add query parameters for GET requests
    const queryParams = parameters.filter((p) => p.in === 'query');
    if (queryParams.length > 0 && isQuery) {
      this.tsCode += `      params: {\n`;
      queryParams.forEach((param) => {
        this.tsCode += `        ${param.name}: args.${param.name},\n`;
      });
      this.tsCode += `      },\n`;
    }

    // Add request body for non-GET requests
    if (requestBody && !isQuery) {
      this.tsCode += `      data: args.body,\n`;
    }

    this.tsCode += `    }))`;

    // Add cache tags for queries
    if (isQuery) {
      this.tsCode += `,\n      providesTags: ['${this.capitalize(feature)}']`;
    } else {
      this.tsCode += `,\n      invalidatesTags: ['${this.capitalize(feature)}']`;
    }

    this.tsCode += `,\n`;

    // Add to endpoint types for export
    const hookPrefix = isQuery ? 'useGet' : 'use';
    const hookName = `${hookPrefix}${this.capitalize(endpointName)}`;
    this.endpointTypes.push(`  ${hookName}`);
  }

  private finalizeApiSlice(): void {
    // Export the combined API for use in the store
    this.tsCode += `// Export the combined API for use in the store\n`;
    this.tsCode += `export const apiReducer = baseApi.reducer;\n`;
    this.tsCode += `export const apiMiddleware = baseApi.middleware;\n`;
  }

  private generateDefaultOperationId(
    method: string,
    path: string,
    summary?: string,
  ): string {
    if (summary) {
      return summary
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    }

    // Create operation ID from method and path
    const pathParts = path
      .split('/')
      .filter((part) => part)
      .map((part) => part.replace(/[^a-z0-9]/gi, ''));

    return `${method.toLowerCase()}${pathParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
  }

  private mapType(type: string): string {
    switch (type) {
      case 'integer':
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        return 'unknown[]';
      case 'object':
        return 'Record<string, unknown>';
      default:
        return 'string';
    }
  }

  private formatPath(path: string): string {
    return path.replace(/{(\w+)}/g, '${args.$1}');
  }

  private camelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export async function generateRtkApiCode(
  openApiJson: OpenApiDocument,
): Promise<string> {
  return new RtkApiGenerator(openApiJson).generate();
}
