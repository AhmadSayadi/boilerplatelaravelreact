import { Role } from "../Roles/Types";

export interface User {
  username: string;
  name: string;
  email: string;
  location?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface UserFormValues {
  name: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  location?: string;
  status: 'active' | 'inactive';
  roles: number[]; // Role IDs
}
