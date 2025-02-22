declare module 'ui/Header' {
  const Header: React.ComponentType;
  export default Header;
}

declare module 'authentication/useFetch' {
  import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

  export function useApiFetch<TData, TError, TVariables>(
    operationId: string,
    queryKey: string[],
    params?: TVariables,
  ): UseQueryResult<TData, TError>;

  export function useApiMutate<TData, TError, TVariables>(
    operationId: string,
    onSuccess?: (data?: TData) => void,
    onError?: (err: unknown) => void,
  ): UseMutationResult<TData, TError, TVariables>;
}

declare module 'authentication/SwaggerApiClient' {
  export interface SwaggerApiClient {
    execute: <T, P extends Record<string, unknown>>(params: P) => Promise<T>;
    setSwaggerUrl: (url: string) => void;
  }
  export default SwaggerApiClient;
}
