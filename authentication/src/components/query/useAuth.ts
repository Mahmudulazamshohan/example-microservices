import { useQueryClient, QueryClient } from '@tanstack/react-query';

import { AuthResponse, LoginData, SignupData } from '../api/index';
import KEYS from './keys';
import { useApiFetch, useApiMutate } from './useFetch';

const TOKEN = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

const key = [KEYS.USER];

const onSuccess =
  (queryClient: QueryClient) =>
  ({ data }) => {
    const { access_token = '', refresh_token = '' } = data;
    localStorage.setItem(TOKEN.ACCESS_TOKEN, access_token);
    localStorage.setItem(TOKEN.REFRESH_TOKEN, refresh_token);
    queryClient.setQueryData(key, data);
  };

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useApiFetch<AuthResponse, Error, LoginData>('me', key);

  const { mutate: login } = useApiMutate<AuthResponse, Error, LoginData>(
    'login',
    onSuccess(queryClient),
  );
  const { mutate: signup } = useApiMutate<AuthResponse, Error, SignupData>(
    'signup',
  );

  const logout = () => {
    localStorage.removeItem(TOKEN.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN.REFRESH_TOKEN);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
  };
};
