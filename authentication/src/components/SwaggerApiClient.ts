import SwaggerClient from 'swagger-client';
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
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
      const API_URL = 'http://localhost/api/authentication';
      this.axiosInstance = axios.create({
        baseURL: API_URL,
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
                .then((token) => {
                  originalRequest.headers['Authorization'] = 'Bearer ' + token;
                  return this.axiosInstance!(originalRequest); // Assert axiosInstance is not null
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            return new Promise((resolve, reject) => {
              this.axiosInstance!.post(
                '/refresh',
                {},
                { headers: { Authorization: `Bearer ${refreshToken}` } },
              )
                .then(({ data }) => data)
                .then(({ data }) => {
                  const { access_token = '', refresh_token = '' } = data;
                  localStorage.setItem('access_token', access_token);
                  localStorage.setItem('refresh_token', refresh_token);
                  this.axiosInstance!.defaults.headers.common['Authorization'] =
                    'Bearer ' + access_token;
                  originalRequest.headers['Authorization'] =
                    'Bearer ' + access_token;
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
    const aToken = localStorage.getItem('access_token');
    const axiosConfig: AxiosRequestConfig = {
      url: options.url,
      method: options.method,
      headers: {
        ...(options?.headers || {}),
        Authorization: options?.headers?.Authentication || `Bearer ${aToken}`,
      },
      data: options?.body ? JSON.parse(options?.body) : {},
      params: options.params,
    };

    return SwaggerApiClient.axiosInstance!(axiosConfig);
  }

  public static getInstance(): Promise<SwaggerClient> {
    if (!SwaggerApiClient.instance) {
      SwaggerApiClient.instance = SwaggerClient({
        url: 'http://localhost/api/authentication/static/swagger.json',
      });
    }
    return SwaggerApiClient.instance;
  }
}

export default SwaggerApiClient;
