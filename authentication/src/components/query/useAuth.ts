import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, fetchUser, AuthResponse, LoginData } from '../api/index';

export const useAuth = () => {
  const queryClient = useQueryClient();
  console.log(queryClient);
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<AuthResponse>({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: !!localStorage.getItem('access_token'),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  const mutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: login,
    onSuccess: ({ data }) => {
      const { access_token = '', refresh_token = '' } = data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      queryClient.setQueryData(['user'], data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    error,
    login: mutation.mutate,
    logout,
  };
};
