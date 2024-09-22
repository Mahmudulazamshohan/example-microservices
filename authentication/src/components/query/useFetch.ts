import { useMutation, useQuery } from '@tanstack/react-query';
import SwaggerApiClient from '../SwaggerApiClient';

export const retryDelay = (attempt: number) =>
  Math.min(1000 * 2 ** attempt, 30000);

export const fetchSwaggerApi = async (operationId: string, parameters = {}) => {
  const client = await SwaggerApiClient.getInstance();
  const aToken = localStorage.getItem('access_token');
  try {
    const { data = {} } = await client.execute({
      operationId,
      parameters: {
        ...parameters,
        Authorization: `Bearer ${aToken}`,
      },
      http: SwaggerApiClient.axiosHttp,
    });
    console.log('fetchSwaggerApi', data);
    return data;
  } catch (err) {
    console.error('fetchSwaggerApi Error', err);
  }
};

export const mutateSwaggerApi = async (
  operationId: string,
  requestBody = {},
) => {
  const client = await SwaggerApiClient.getInstance();
  const { data = {} } = await client.execute({
    operationId,
    requestBody,
    http: SwaggerApiClient.axiosHttp,
  });
  return data;
};

export function useApiFetch<TData, TError, TVariables>(
  operationId: string,
  queryKey: string[],
  params?: object,
) {
  return useQuery<TData, TError, TVariables>({
    queryKey,
    queryFn: async () => await fetchSwaggerApi(operationId, params),
    retry: 3,
    retryDelay,
    staleTime: 10,
  });
}

export function useApiMutate<TData, TError, TVariables>(
  operationId: string,
  onSuccess?: (data?: TData) => void,
  onError?: (err: unknown) => void,
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (body) => await mutateSwaggerApi(operationId, body ?? {}),
    onSuccess,
    onError,
  });
}
