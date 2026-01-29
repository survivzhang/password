export interface User {
  id: number;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface PasswordItem {
  id: number;
  website: string;
  username: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PasswordItemWithDecrypted extends PasswordItem {
  decryptedPassword: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
