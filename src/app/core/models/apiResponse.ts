
export interface apiResponse<T> {
  message: string;
  error: boolean;
  statusCode?: number;
  data?: T;
  pagination?: pagination
  transaction?: T;
  access_token?: string;
}


interface pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  count: number
}