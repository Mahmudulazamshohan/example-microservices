export interface IJsObject<T = any> {
  [key: string]: T;
}

export interface IApiError {
  message: string;
  code?: number;
  extra?: IJsObject | (IJsObject | string)[];
}

export interface IMetadata extends IJsObject {
  timestamp: string;
  path?: string;
  pages?: number;
  perPage?: number;
  total?: number;
}

export interface IApiResponse<T = unknown> {
  metadata?: IJsObject;
  data?: T;
  status: string;
  message: string;
  errors?: string[];
}
