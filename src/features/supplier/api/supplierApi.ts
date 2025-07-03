import axiosInstance from "@/shared/configs/axios";
import { SupplierEndpoints } from "./supplierEndpoints";
import { SupplierData, SupplierResponse, SuppliersResponse } from "../type/supplierType";

// Thêm nguyên liệu
export const createSupplier = async (data: SupplierData): Promise<SupplierResponse> => 
  axiosInstance.post(SupplierEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật nguyên liệu
export const updateSupplier = async (data: SupplierData, id: string): Promise<SupplierResponse> => 
  axiosInstance.put(SupplierEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả nguyên liệu
export const getAllSupplier = async(): Promise<SuppliersResponse> => 
    axiosInstance.get(SupplierEndpoints.GET_ALL);
// Lấy nguyên liệu theo id
export const getSupplierById = async(id: string): Promise<SupplierResponse> => 
    axiosInstance.get(SupplierEndpoints.GET_BY_ID(id));
// Xóa nguyên liệu
export const deleteSupplier = async(id: string): Promise<SupplierResponse> => 
    axiosInstance.delete(SupplierEndpoints.DELETE(id))