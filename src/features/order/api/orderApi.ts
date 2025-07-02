import axiosInstance from "@/shared/configs/axios";
import { OrderEndpoints } from "./orderEndpoints";
import { OrderData, OrderResponse, OrdersResponse } from "../type/orderType";
import { OrderProductItem } from "@/features/user/type/userTypes";

// Thêm đơn hàng
export const createOrder = async (data: OrderData): Promise<OrderResponse> => 
  axiosInstance.post(OrderEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật đơn hàng
export const updateOrder = async (data: OrderData, id: string): Promise<OrderResponse> => 
  axiosInstance.put(OrderEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Cập nhật sản phẩm trong đơn hàng
export const updateProductOrder = async (data: OrderProductItem, id: string, pid: string): Promise<OrderResponse> => 
  axiosInstance.put(OrderEndpoints.UPDATE_PRODUCT_ORDER(id, pid), data, {
    withCredentials: true,
});
// Hiển thị tất cả đơn hàng
export const getAllOrder = async(): Promise<OrdersResponse> => 
    axiosInstance.get(OrderEndpoints.GET_ALL);
// Lấy đơn hàng theo id
export const getOrderById = async(id: string): Promise<OrderResponse> => 
    axiosInstance.get(OrderEndpoints.GET_BY_ID(id));
// Xóa đơn hàng
export const deleteOrder = async(id: string): Promise<OrderResponse> => 
    axiosInstance.delete(OrderEndpoints.DELETE(id))
// Xóa sản phẩm trong đơn hàng
export const deleteProductOrder = async(id: string, pid: string): Promise<OrderResponse> => 
    axiosInstance.delete(OrderEndpoints.DELETE_PRODUCT_ORDER(id, pid))