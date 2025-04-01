import SwaggerClient from 'swagger-client';
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';
import process from 'process';
import { getToken } from './utils';
import { TOKEN } from './types';
import { SecureStorage } from './utils/secureStorage';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

class SwaggerApiClient {
  private static instance: SwaggerClient | null = null;
  private static axiosInstance: AxiosInstance | null = null;

  private constructor() {}

  private static initAxiosInstance() {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL: process?.env?.AUTHENTICATION_API || '',
      });

      this.axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
          const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
            error.config;

          // If 401 Unauthorized and the request hasn't been retried
          if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token: string) => {
                  originalRequest.headers['Authorization'] = getToken(token);
                  return this.axiosInstance!(originalRequest); // Assert axiosInstance is not null
                })
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = SecureStorage.getItem(TOKEN.REFRESH_TOKEN);

            return new Promise((resolve, reject) => {
              this.axiosInstance!.post(
                '/refresh',
                {},
                { headers: { Authorization: getToken(refreshToken) } },
              )
                .then(({ data }) => data)
                .then(({ data }) => {
                  const { access_token = '', refresh_token = '' } = data;
                  SecureStorage.setItem(TOKEN.ACCESS_TOKEN, access_token);
                  SecureStorage.setItem(TOKEN.REFRESH_TOKEN, refresh_token);

                  this.axiosInstance!.defaults.headers.common['Authorization'] =
                    getToken(access_token);
                  originalRequest.headers['Authorization'] =
                    getToken(access_token);
                  processQueue(null, access_token);
                  resolve(this.axiosInstance!(originalRequest));
                })
                .catch((err) => {
                  processQueue(err, null);
                  reject(err);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            });
          }

          return Promise.reject(error);
        },
      );
    }
  }

  public static axiosHttp(options) {
    if (!SwaggerApiClient.axiosInstance) {
      SwaggerApiClient.initAxiosInstance();
    }

    const aToken = SecureStorage.getItem(TOKEN.ACCESS_TOKEN);
    const axiosConfig: AxiosRequestConfig = {
      url: options.url,
      method: options.method,
      headers: {
        ...(options?.headers || {}),
        Authorization: options?.headers?.Authentication || getToken(aToken),
      },
      data: options?.body ? JSON.parse(options?.body) : {},
      params: options.params,
    };

    return SwaggerApiClient.axiosInstance!(axiosConfig);
  }

  public static getInstance(): Promise<SwaggerClient> {
    console.log('process.env.SWAGGER_URL', process?.env?.SWAGGER_URL);
    if (!process?.env?.SWAGGER_URL) {
      throw new Error('SWAGGER_URL not defined');
    }

    if (!SwaggerApiClient.instance) {
      SwaggerApiClient.instance = SwaggerClient({
        url: process?.env?.SWAGGER_URL,
      });
    }
    return SwaggerApiClient.instance;
  }
}

export default SwaggerApiClient;
