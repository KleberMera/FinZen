export interface User {
  id?: number;
  rol_id: number;
  name: string;
  last_name: string;
  username: string;
  user: string;
  email: string;
  password: string;
  phone: string;
  status: boolean;
}

export interface UserResponse {
  message: string;
  error?: boolean;
  statusCode?: number;
  data?: User;
}
