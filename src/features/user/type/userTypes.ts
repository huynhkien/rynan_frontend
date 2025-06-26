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
