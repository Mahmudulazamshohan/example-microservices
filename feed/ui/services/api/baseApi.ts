import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SecureStorage } from '../storage/secureStorage';
import { TOKEN } from '../../shared/types';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost/api/feed',
    prepareHeaders: (headers: any) => {
      const token = SecureStorage.getItem(TOKEN.ACCESS_TOKEN);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
