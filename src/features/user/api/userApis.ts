import axiosInstance from "@/shared/configs/axios";
import { LoginData, LoginResponse, RegisterData, RegisterResponse, UserResponse } from "../type/userTypes";


export const apiRegister = async (data: RegisterData): Promise<RegisterResponse> => axiosInstance({
    url: '/user/register/',
    method: 'post',
    data,
    withCredentials: true,
    });
export const apiLogin = async (data: LoginData): Promise<LoginResponse> => axiosInstance({
    url: '/user/login/',
    method: 'post',
    data,
    withCredentials: true,
});
export const apiGetUser = async (pid: string): Promise<UserResponse> => axiosInstance({
    url: '/user/' + pid,
    method: 'get',
})
export const apiGetCurrent = async (): Promise<UserResponse> => axiosInstance({
    url: '/user/current/',
    method: 'get',
})