export function removeProperties<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  return Object.keys(obj).reduce(
    (acc: T, key) => {
      if (!keys.includes(key as K)) {
        acc[key as K] = obj[key as K];
      }
      return acc;
    },
    {} as Omit<T, K>,
  );
}

export function getToken(token: string): string {
  return token?.replace('Bearer ', '')?.trim() ?? '';
}
