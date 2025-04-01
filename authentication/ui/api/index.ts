import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { SecureStorage } from '../utils/secureStorage';
import { TOKEN } from '../types';

const BASE_URL = 'http://localhost/api/authentication';

// Type definitions for schemas
export interface SignupDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface ApiResponse {
  metadata?: Record<string, unknown>; // Metadata related to the response
  data?: Record<string, unknown>; // The actual data of the response
  status: string; // The status of the response
  message: string; // Message describing the response
  errors?: unknown[]; // List of errors if any
}

export interface LoginDto {
  username: string; // Username of user
  password: string; // Password
}

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = TOKEN.ACCESS_TOKEN;
  private static readonly REFRESH_TOKEN_KEY = TOKEN.REFRESH_TOKEN;

  static setTokens(accessToken: string, refreshToken: string): void {
    SecureStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    SecureStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getAccessToken(): string | null {
    return SecureStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return SecureStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    SecureStorage.removeItem(this.ACCESS_TOKEN_KEY);
    SecureStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
const failedQueue: QueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
): void => {
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

// Add request interceptor to automatically add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor with token refresh logic
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request if already refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof token === 'string') {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = TokenManager.getRefreshToken();

        if (!refreshToken) {
          // No refresh token available, redirect to login
          TokenManager.clearTokens();
          window.location.href = '/login';
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          '/refresh',
          {},
          {
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );

        const { access_token, refresh_token } = response.data.data;

        // Store new tokens
        TokenManager.setTokens(access_token, refresh_token);

        // Update axios default headers
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${access_token}`;

        // Update current request headers
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        // Process queued requests
        processQueue(null, access_token);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Handle refresh token failure
        processQueue(err as AxiosError, null);

        // Clear tokens on auth failure
        TokenManager.clearTokens();

        // Redirect to login page
        window.location.href = '/login';

        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export async function signup(
  body: SignupDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/signup`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response?.data ?? {};
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in signup: ${error.message}`);
    }
    throw error;
  }
}

export async function login(
  body: LoginDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/login`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response?.data ?? {};
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in login: ${error.message}`);
    }
    throw error;
  }
}

export async function refresh(
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/refresh`,
    headers: { ...headers },
  };

  try {
    const response = await axiosInstance(config);
    return response?.data ?? {};
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in refresh: ${error.message}`);
    }
    throw error;
  }
}

export async function me(
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `/me`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response?.data ?? {};
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in me: ${error.message}`);
    }
    throw error;
  }
}

export async function getProfile(
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `/users/profile`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response?.data ?? {};
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in getProfile: ${error.message}`);
    }
    throw error;
  }
}

export async function deleteProfile(
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `/users/profile`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response?.data ?? {};
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in deleteProfile: ${error.message}`);
    }
    throw error;
  }
}
