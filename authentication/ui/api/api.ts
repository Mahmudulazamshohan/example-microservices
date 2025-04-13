import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SecureStorage } from '../storage/secureStorage';
import { TOKEN } from '../shared/types';

import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
    async ({
      url,
      method,
      data,
      params,
      headers,
    }: {
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
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

export interface SignupDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface ApiResponse {
  metadata?: Record<string, unknown>;
  data?: Record<string, unknown>;
  status: string;
  message: string;
  errors?: unknown[];
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface ApiResponse<T extends any> {
  data: T;
  message: string;
  statusCode: number;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: 'http://localhost/api/authentication',
  }),
  endpoints: () => ({}),
  tagTypes: ['Posts', 'Comments', 'Connections', 'Likes'],
});

export const signupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<ApiResponse, { body: SignupDto }>((args: any) => ({
      url: `/signup`,
      method: 'post',
      data: args.body,
    })),
    invalidatesTags: ['Signup'],
  }),
  overrideExisting: false,
});

export const { useSignup } = signupApi;

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse, { body: LoginDto }>((args) => ({
      url: `/login`,
      method: 'post',
      data: args.body,
    })),
    invalidatesTags: ['Login'],
  }),
  overrideExisting: false,
});

export const { useLogin } = loginApi;

export const refreshApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refresh: builder.mutation<ApiResponse, void>((_) => ({
      url: `/refresh`,
      method: 'post',
    })),
    invalidatesTags: ['Refresh'],
  }),
  overrideExisting: false,
});

export const { useRefresh } = refreshApi;

export const meApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<ApiResponse, void>((_) => ({
      url: `/me`,
      method: 'get',
    })),
    providesTags: ['Me'],
  }),
  overrideExisting: false,
});

export const { useGet } = meApi;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>((_) => ({
      url: `/users/profile`,
      method: 'get',
    } as any)),
    // providesTags: ['Users'],
    deleteProfile: builder.mutation<ApiResponse, void>((_) => ({
      url: `/users/profile`,
      method: 'delete',
    })),
    invalidatesTags: ['Users'],
  }),
  overrideExisting: false,
});

export const { useGetGetProfile, useDeleteProfile } = usersApi;

export const apiReducer = baseApi.reducer;
export const apiMiddleware = baseApi.middleware;
