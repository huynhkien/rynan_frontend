export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  refreshToken?: string;
  passwordChangedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  registerToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    address?: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  success: boolean;
  data: UserData ;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  userData: UserData;
}