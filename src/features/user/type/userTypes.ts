import { FormInputProps, InputImageProps } from "@/types/components/input";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  refreshToken?: string;
  passwordChangedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  registerToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserDataAddress{
  street: string,
  city: string,
  ward: string,
  district: string,
  country: string,
  zipCode: string,
}
export interface UserDataAvatar{
  url: string,
  public_id: string,
}
export interface UserDataProps extends Record<string, unknown> {
    code: string;
    sku: string;
    name: string;
    address: UserDataAddress;
    dateOfBirth: Date;
    gender: string;
    identification_card: string;
    tax_code: string;
    lastLoginAt: string;
    note?: string;
    invoice_address: string;
    staff: string;
    type: string;
    source: string;
    website?: string;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
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
  data: UserData;
}

// Quản lý trạng thái với redux
export interface UserState {
  isLogin: boolean;
  current: UserData | null;
  token: string | null;
  isLoading: boolean;
  mes: string;
  cart: CartItem[];
}

export interface LoginPayload {
  isLogin: boolean;
  token: string;
  userData: UserData;
}
// Giỏ hàng 

export interface CartItem {
  pid: string;
  thumb: string;
  name: string;
  price: number;
  quantity: number;
}
// input
export type UserFormInputProps = FormInputProps<UserDataProps>;
export type UserImageInputProps = InputImageProps<UserDataProps>;
