import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SecureStorage } from '../../c';
import { TOKEN } from '../../types';

export interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: any; // Replace with your user type
  };
}

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData extends LoginData {
  firstname: string;
  lastname: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost/api/authentication',
    prepareHeaders: (headers) => {
      const token = SecureStorage.getItem(TOKEN.ACCESS_TOKEN);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginData>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          SecureStorage.setItem(TOKEN.ACCESS_TOKEN, data.data.access_token);
          SecureStorage.setItem(TOKEN.REFRESH_TOKEN, data.data.refresh_token);
        } catch {}
      },
    }),
    signup: builder.mutation<AuthResponse, SignupData>({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    getMe: builder.query<AuthResponse, void>({
      query: () => '/me',
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          SecureStorage.removeItem(TOKEN.ACCESS_TOKEN);
          SecureStorage.removeItem(TOKEN.REFRESH_TOKEN);
        } catch {}
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
