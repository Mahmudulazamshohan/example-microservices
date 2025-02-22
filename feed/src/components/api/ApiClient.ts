import SwaggerClient from 'swagger-client';
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';
import process from 'process';
import { getToken } from '../utils';
import { TOKEN } from '../types';
import { SecureStorage } from '../utils/secureStorage';

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

interface TokenResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

class HttpClient {
  private static instance: SwaggerClient | null = null;
  private static axiosInstance: AxiosInstance | null = null;
  private static isRefreshing = false;
  private static failedQueue: QueueItem[] = [];
  private static swaggerUrl: string | null = null;

  private constructor() {}

  private static processQueue(
    error: AxiosError | null,
    token: string | null = null,
  ): void {
    HttpClient.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    HttpClient.failedQueue = [];
  }

  private static initAxiosInstance(): void {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL: process?.env?.AUTHENTICATION_API || '',
        timeout: 5000, // Add reasonable timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.setupInterceptors();
    }
  }

  private static setupInterceptors(): void {
    if (!this.axiosInstance) return;

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (HttpClient.isRefreshing) {
            try {
              const token = await new Promise<string>((resolve, reject) => {
                HttpClient.failedQueue.push({ resolve, reject });
              });
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: getToken(token),
              };
              return this.axiosInstance!(originalRequest);
            } catch (err) {
              return Promise.reject(err);
            }
          }

          originalRequest._retry = true;
          HttpClient.isRefreshing = true;

          try {
            const refreshToken = SecureStorage.getItem(TOKEN.REFRESH_TOKEN);
            const response = await this.axiosIn stance.post<TokenResponse>(
              '/refresh',
              {},
              { headers: { Authorization: getToken(refreshToken) } },
            );

            const { access_token, refresh_token } = response.data.data;
            SecureStorage.setItem(TOKEN.ACCESS_TOKEN, access_token);
            SecureStorage.setItem(TOKEN.REFRESH_TOKEN, refresh_token);

            if (this.axiosInstance) {
              this.axiosInstance.defaults.headers.common['Authorization'] =
                getToken(access_token);
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: getToken(access_token),
              };
            }

            HttpClient.processQueue(null, access_token);
            return this.axiosInstance!(originalRequest);
          } catch (err) {
            HttpClient.processQueue(err as AxiosError, null);
            return Promise.reject(err);
          } finally {
            HttpClient.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  public static setSwaggerUrl(url: string): void {
    HttpClient.swaggerUrl = url;
  }

  public static request<T = any>(options: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: string;
    params?: Record<string, any>;
  }): Promise<AxiosResponse<T>> {
    if (!HttpClient.axiosInstance) {
      HttpClient.initAxiosInstance();
    }

    const aToken = SecureStorage.getItem(TOKEN.ACCESS_TOKEN);
    const axiosConfig: AxiosRequestConfig = {
      url: options.url,
      method: options.method,
      headers: {
        ...(options?.headers || {}),
        Authorization:
          options?.headers?.Authentication || (aToken ? getToken(aToken) : ''),
      },
      data: options?.body ? JSON.parse(options?.body) : {},
      params: options.params,
    };

    return HttpClient.axiosInstance!(axiosConfig);
  }

  public static async getInstance(): Promise<SwaggerClient> {
    const url = HttpClient.swaggerUrl || process?.env?.SWAGGER_URL;

    if (!url) {
      throw new Error(
        'Swagger URL not defined. Set it using setSwaggerUrl or SWAGGER_URL env variable',
      );
    }

    if (!HttpClient.instance) {
      HttpClient.instance = await SwaggerClient({
        url,
        requestInterceptor: (req: any) => {
          const token = SecureStorage.getItem(TOKEN.ACCESS_TOKEN);
          if (token) {
            req.headers.Authorization = getToken(token);
          }
          return req;
        },
      });
    }
    return HttpClient.instance;
  }
}

export default HttpClient;
