
export interface apiResponse<T> {
  message: string;
  error: boolean;
  statusCode?: number;
  data?: T;
  transaction?: T;
  access_token?: string;
}