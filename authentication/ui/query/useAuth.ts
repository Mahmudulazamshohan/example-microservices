import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { SecureStorage } from '../utils/secureStorage';
// import { AuthResponse, LoginData, SignupData } from '../api/index';
import KEYS from './keys';
import { useApiFetch, useApiMutate } from './useFetch';
import { TOKEN } from '../types';

const key = [KEYS.USER];

const onSuccess =
  (queryClient: QueryClient) =>
  ({ data }) => {
    const { access_token = '', refresh_token = '' } = data;
    SecureStorage.setItem(TOKEN.ACCESS_TOKEN, access_token);
    SecureStorage.setItem(TOKEN.REFRESH_TOKEN, refresh_token);
    queryClient.setQueryData(key, data);
  };

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useApiFetch<any, Error, any>('me', key);

  const { mutate: login } = useApiMutate<any, Error, any>(
    'login',
    onSuccess(queryClient),
  );

  const { mutate: signup } = useApiMutate<any, Error, any>('signup');

  const logout = () => {
    SecureStorage.removeItem(TOKEN.ACCESS_TOKEN);
    SecureStorage.removeItem(TOKEN.REFRESH_TOKEN);
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
