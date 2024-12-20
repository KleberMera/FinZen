
export interface apiResponse<T> {
  message: string;
  error: boolean;
  statusCode?: number;
  data?: T;
  access_token?: string;
}