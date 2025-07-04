import { ReceiptMaterialData } from "@/features/receipt/type/receiptType";
import { FormInputProps, InputImageProps } from "@/types/components/input";

// UPdate
export interface UpdateDataUser{
  isUpdateDataUser?: boolean;
  render?: () => void;
}

export interface UserData {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  code?: string;
  role?: string;
  gender?: string;
  address?: UserDataAddress;
  identification_card?: string;
  dateOfBirth?: string | Date;
  source?: string;
  tax_code?: string;
  invoice_address?: string;
  note?: string;
  staff?: string;
  website?: string;
  refreshToken?: string;
  passwordChangedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  registerToken?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  lastLoginAt: string;
  avatar: UserDataAvatar;
}
export interface UserDataAddress{
  detail: string,
  addressAdd: string
  province: {
    code: string | number;
    name: string;
  };
  district: {
    code: string | number;
    name: string;
  };
  ward: {
    code: string | number;
    name: string;
  };
}
export interface UserDataAvatar{
  url: string,
  public_id: string,
}
export interface UserDataProps extends Record<string, unknown> {
    code: string;
    sku: string;
    name: string;
    phone: string;
    email: string;
    avatar: FileList;
    address: UserDataAddress;
    dateOfBirth: string | Date;
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
    role: string;
    createdAt: Date;
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
  data?: UserData ;
  message?: string;
}
export interface UsersResponse {
  success: boolean;
  data: UserData[] ;
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
  quoteProduct: QuoteProductItem[];
  orderProduct: OrderProductItem[];
  materialReceipt: ReceiptMaterialData[];
}

export interface LoginPayload {
  isLogin: boolean;
  token: string;
  userData: UserData;
}
// Giỏ hàng 
export interface CartItem {
  pid?: string;
  thumb?: string;
  name?: string;
  price?: number;
  quantity: number;
}
// Báo giá
interface QuoteProductPricesData {
  priceType: string;
  price: number;
  startDate: string | Date;
  endDate: string | Date;
  note?: string;
}
export interface QuoteProductItem {
  pid: string | number;
  code?: string,
  name?: string;
  prices?: QuoteProductPricesData[];
  provide_nutrition?: string;
  crop?: string;
  stage?: string;
  origin?: string;
  specification?: string;
  specifications?: string;
  thumb?: string;
}
export interface QuoteItem {
  qid: string;
  quotation: string;
  products: QuoteProductItem[];
  client: string;
}
// Sản phẩm Đơn hàng
export interface OrderProductItem {
  pid: string | number;
  quantity: number;
  name?: string;
  priceType?: string;
  price?: number;
  thumb?: string;
}
// input
export type UserFormInputProps = FormInputProps<UserDataProps>;
export type UserImageInputProps = InputImageProps<UserDataProps>;

