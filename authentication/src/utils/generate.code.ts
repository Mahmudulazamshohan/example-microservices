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

export class ApiCodeGenerator {
  private tsCode: string = '';
  private readonly baseUrl: string;

  constructor(private readonly openApiJson: OpenApiDocument) {
    this.baseUrl = openApiJson.servers?.[0]?.url || '';
  }

  public async generate(): Promise<string> {
    this.addImports();
    this.generateSchemas();
    this.addAxiosInterceptor();
    this.generateApiFunctions();
    return format(this.tsCode, {
      parser: 'typescript',
      singleQuote: true,
    });
  }

  private addImports(): void {
    this.tsCode += `
    import axios, { 
      AxiosError,
      AxiosInstance,
      AxiosRequestConfig,
      AxiosResponse 
    } from 'axios';
    import { SecureStorage } from '../utils/secureStorage';
    import { TOKEN } from '../types';\n\n`;

    this.tsCode += `const BASE_URL = '${this.baseUrl}';\n\n`;
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

  private addAxiosInterceptor(): void {
    this.tsCode += `
      interface QueueItem {
        resolve: (value: unknown) => void;
        reject: (error: unknown) => void;
      }

      let isRefreshing = false;
      const failedQueue: QueueItem[] = [];

      const processQueue = (error: AxiosError | null, token: string | null = null): void => {
        failedQueue.forEach((prom) => {
          if (error) {
            prom.reject(error);
          } else {
            prom.resolve(token);
          }
        });
        failedQueue.length = 0;
      };

      export const axiosInstance: AxiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
          const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
          
          if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
              try {
                const token = await new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
                });
                originalRequest.headers!['Authorization'] = \`Bearer \${token}\`;
                return axiosInstance(originalRequest);
              } catch (err) {
                return Promise.reject(err);
              }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
              const refreshToken = SecureStorage.getItem(TOKEN.REFRESH_TOKEN);
              const response = await axiosInstance.post('/refresh', {}, {
                headers: { Authorization: \`Bearer \${refreshToken}\` }
              });

              const { access_token, refresh_token } = response.data.data;
              SecureStorage.setItem(TOKEN.ACCESS_TOKEN, access_token);
              SecureStorage.setItem(TOKEN.REFRESH_TOKEN, refresh_token);

              axiosInstance.defaults.headers.common['Authorization'] = \`Bearer \${access_token}\`;
              originalRequest.headers!['Authorization'] = \`Bearer \${access_token}\`;
              
              processQueue(null, access_token);
              return axiosInstance(originalRequest);
            } catch (err) {
              processQueue(err as AxiosError, null);
              throw err;
            } finally {
              isRefreshing = false;
            }
          }
          return Promise.reject(error);
        },
      );\n\n`;
  }

  private generateApiFunctions(): void {
    const { paths } = this.openApiJson;

    for (const [path, methods] of Object.entries(paths)) {
      // Handle each HTTP method for the path
      Object.entries(methods).forEach(([method, operation]) => {
        if (operation.operationId) {
          this.generateApiFunction(path, method, operation);
        } else {
          // Generate default operationId if not provided
          const defaultOperationId = this.generateDefaultOperationId(
            method,
            path,
            operation.summary,
          );
          this.generateApiFunction(path, method, {
            ...operation,
            operationId: defaultOperationId,
          });
        }
      });
    }
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

  private generateApiFunction(
    path: string,
    method: string,
    operation: OpenApiOperation,
  ): void {
    const operationId = operation.operationId!;
    const parameters = operation.parameters || [];
    const requestBody = operation.requestBody;

    this.tsCode += `export async function ${operationId}(`;

    // Parameters
    const params: string[] = [];
    parameters.forEach((param) => {
      if (param.in === 'query' || param.in === 'path') {
        params.push(
          `${param.name}${param.required ? '' : '?'}: ${this.mapType(param.schema.type)}`,
        );
      }
    });

    // Request body
    if (requestBody?.content['application/json']?.schema?.$ref) {
      const schemaName = requestBody.content['application/json'].schema.$ref
        .split('/')
        .pop();
      params.push(`body: ${schemaName}`);
    }

    // Headers
    params.push('headers?: Record<string, string>');
    this.tsCode += params.join(', ');
    this.tsCode += '): Promise<ApiResponse> {\n';

    // Configuration
    this.tsCode += `  const config: AxiosRequestConfig = {
    method: '${method}',
    url: \`${path}\`,
    headers: { ...headers },
    ${['get', 'delete'].includes(method) ? 'params: {' : 'data: body,'}
    ${parameters
      .filter((p) => p.in === 'query')
      .map((p) => `    ${p.name}: ${p.name},`)
      .join('\n')}
    ${['get', 'delete'].includes(method) ? '},' : ''}
  };\n\n`;

    // Try-catch block
    this.tsCode += `  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(\`Error in ${operationId}: \${error.message}\`);
    }
    throw error;
  }\n`;
    this.tsCode += '}\n\n';
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
}

export async function generateApiCode(
  openApiJson: OpenApiDocument,
): Promise<string> {
  return new ApiCodeGenerator(openApiJson).generate();
}
