import axiosInstance from "@/shared/configs/axios";
import { LoginData, LoginResponse, RegisterData, RegisterResponse, UserResponse, UsersResponse } from "../type/userTypes";
import { UserEndpoints } from "./userEndpoints";


// đăng ký tài khoản
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => 
  axiosInstance.post(UserEndpoints.REGISTER, data, {
    withCredentials: true,
    
});
// check mail
export const checkMail = async (email: string): Promise<RegisterResponse> => 
  axiosInstance.post(UserEndpoints.CHECK_MAIL, { email }, {
    withCredentials: true,
    
});
// Thêm quyền cho nhân viên
export const addRole = async (data: FormData): Promise<RegisterResponse> => 
  axiosInstance.post(UserEndpoints.ADD_ROLE, data, {
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
  axiosInstance.get(UserEndpoints.GET_CURRENT);

// Lấy tất cả thông tin người dùng
export const getAllUser = async (): Promise<UsersResponse> => 
  axiosInstance.get(UserEndpoints.GET_ALL);
// thêm thông tin
export const addUserByAdmin = async (data: FormData): Promise<RegisterResponse> => 
  axiosInstance.post(UserEndpoints.ADD, data, {
    withCredentials: true,
});
// cập nhật thông tin
export const updateUserByAdmin = async (id: string, data: FormData): Promise<RegisterResponse> => 
  axiosInstance.put(UserEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Cập nhật thông tin bởi người dùng
export const updateInfoByUser = async (id: string, data: FormData): Promise<RegisterResponse> => 
  axiosInstance.put(UserEndpoints.UPDATE_INFO(id), data, {
    withCredentials: true,
});
// Xóa thông tin người dùng
export const deleteUser = async (id: string): Promise<UserResponse> => 
  axiosInstance.delete(UserEndpoints.DELETE(id));
