import axiosInstance from "@/shared/configs/axios";
import { OrderEndpoints } from "./orderEndpoints";
import { OrderResponse, OrdersResponse } from "../type/orderType";

// Thêm đơn hàng
export const createCategory = async (data: FormData): Promise<OrderResponse> => 
  axiosInstance.post(OrderEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật đơn hàng
export const updateCategory = async (data: FormData, id: string): Promise<OrderResponse> => 
  axiosInstance.put(OrderEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả đơn hàng
export const getAllCategory = async(): Promise<OrdersResponse> => 
    axiosInstance.get(OrderEndpoints.GET_ALL);
// Lấy đơn hàng theo id
export const getCategoryById = async(id: string): Promise<OrderResponse> => 
    axiosInstance.get(OrderEndpoints.GET_BY_ID(id));
// Xóa đơn hàng
export const deleteCategory = async(id: string): Promise<OrderResponse> => 
    axiosInstance.delete(OrderEndpoints.DELETE(id))