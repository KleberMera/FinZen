export interface User {
  id: number | null;
  rol_id: number;
  name: string;
  last_name: string;
  username: string;
  user: string;
  email: string;
  password: string;
  firebaseUid:string
  confirm_password: string;
  phone: string;
  avatar: string;
  status: boolean;
  createdAt:string
}

