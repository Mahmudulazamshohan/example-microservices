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

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers!['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = SecureStorage.getItem(TOKEN.REFRESH_TOKEN);
        const response = await axiosInstance.post(
          '/refresh',
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );

        const { access_token, refresh_token } = response.data.data;
        SecureStorage.setItem(TOKEN.ACCESS_TOKEN, access_token);
        SecureStorage.setItem(TOKEN.REFRESH_TOKEN, refresh_token);

        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${access_token}`;
        originalRequest.headers!['Authorization'] = `Bearer ${access_token}`;

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
    return response.data;
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
    return response.data;
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
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in deleteProfile: ${error.message}`);
    }
    throw error;
  }
}
