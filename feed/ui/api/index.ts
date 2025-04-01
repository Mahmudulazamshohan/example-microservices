import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { SecureStorage } from '../utils/secureStorage';
import { TOKEN } from '../types';

const BASE_URL = 'http://localhost/api/feed';

// Type definitions for schemas
export interface CreateCommentDto {
  user_id: number; // User ID
  post_id: number; // Post ID
  content: string; // Comment content
}

export interface CreateConnectionDto {}

export interface CreateLikeDto {}

export interface CreatePostDto {}

export interface UpdatePostDto {}

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

        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${access_token}`;
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

export async function createComment(
  body: CreateCommentDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/comments`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in createComment: ${error.message}`);
    }
    throw error;
  }
}

export async function deleteComment(
  id: number,
  body: CreateCommentDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `/comments/${id}`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in deleteComment: ${error.message}`);
    }
    throw error;
  }
}

export async function ConnectionsController_index(
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `/connections`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in ConnectionsController_index: ${error.message}`);
    }
    throw error;
  }
}

export async function createConnection(
  body: CreateConnectionDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/connections`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in createConnection: ${error.message}`);
    }
    throw error;
  }
}

export async function getConnections(
  user_id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `/connections/${user_id}`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in getConnections: ${error.message}`);
    }
    throw error;
  }
}

export async function ConnectionsController_accept(
  id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `/connections/${id}/accept`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in ConnectionsController_accept: ${error.message}`);
    }
    throw error;
  }
}

export async function ConnectionsController_reject(
  id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `/connections/${id}/reject`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in ConnectionsController_reject: ${error.message}`);
    }
    throw error;
  }
}

export async function ConnectionsController_remove(
  id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `/connections/${id}`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in ConnectionsController_remove: ${error.message}`);
    }
    throw error;
  }
}

export async function LikesController_likePost(
  body: CreateLikeDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/likes`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in LikesController_likePost: ${error.message}`);
    }
    throw error;
  }
}

export async function LikesController_unlikePost(
  post_id: number,
  user_id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `/likes/${post_id}/${user_id}`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in LikesController_unlikePost: ${error.message}`);
    }
    throw error;
  }
}

export async function PostsController_create(
  body: CreatePostDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `/posts`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in PostsController_create: ${error.message}`);
    }
    throw error;
  }
}

export async function PostsController_findAll(
  user_id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `/posts`,
    headers: { ...headers },
    params: {
      user_id: user_id,
    },
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in PostsController_findAll: ${error.message}`);
    }
    throw error;
  }
}

export async function PostsController_findOne(
  id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `/posts/${id}`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in PostsController_findOne: ${error.message}`);
    }
    throw error;
  }
}

export async function PostsController_update(
  id: number,
  body: UpdatePostDto,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `/posts/${id}`,
    headers: { ...headers },
    data: body,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in PostsController_update: ${error.message}`);
    }
    throw error;
  }
}

export async function PostsController_remove(
  id: number,
  headers?: Record<string, string>,
): Promise<ApiResponse> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `/posts/${id}`,
    headers: { ...headers },
    params: {},
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in PostsController_remove: ${error.message}`);
    }
    throw error;
  }
}
