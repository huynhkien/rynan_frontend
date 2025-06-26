import axiosInstance from "@/shared/configs/axios";
import { LoginData, LoginResponse, RegisterData, RegisterResponse, UserResponse } from "../type/userTypes";
import { UserEndpoints } from "./userEndpoints";


// đăng ký tài khoản
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => 
  axiosInstance.post(UserEndpoints.REGISTER, data, {
    withCredentials: true,
    
});
// Đăng nhập
export const loginUser = async (data: LoginData): Promise<LoginResponse> => 
  axiosInstance.post(UserEndpoints.LOGIN, data, {
    withCredentials: true,
});
// Lấy thông tin người dùng theo id
export const getUserById = async (id: string): Promise<UserResponse> => 
  axiosInstance.get(UserEndpoints.GET_BY_ID(id));
// Lấy thông tin người dùng theo _id trong token
export const getUserCurrent = async (): Promise<UserResponse> => 
  axiosInstance.get(UserEndpoints.GET_CURRENT());