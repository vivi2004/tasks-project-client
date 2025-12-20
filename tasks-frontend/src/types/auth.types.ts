export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}