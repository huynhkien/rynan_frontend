import axiosInstance from "@/shared/configs/axios";
import { MaterialData, MaterialResponse, MaterialsResponse } from "../type/materialType";
import { MaterialEndpoints } from "./materialEndpoints";

// Thêm nguyên liệu
export const createMaterial = async (data: MaterialData): Promise<MaterialResponse> => 
  axiosInstance.post(MaterialEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật nguyên liệu
export const updateMaterial = async (data: MaterialData, id: string): Promise<MaterialResponse> => 
  axiosInstance.put(MaterialEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả nguyên liệu
export const getAllMaterial = async(): Promise<MaterialsResponse> => 
    axiosInstance.get(MaterialEndpoints.GET_ALL);
// Lấy nguyên liệu theo id
export const getMaterialById = async(id: string): Promise<MaterialResponse> => 
    axiosInstance.get(MaterialEndpoints.GET_BY_ID(id));
// Xóa nguyên liệu
export const deleteMaterial = async(id: string): Promise<MaterialResponse> => 
    axiosInstance.delete(MaterialEndpoints.DELETE(id))
// Xóa nhiều
export const deleteMaterials = async (ids: string[]): Promise<MaterialResponse> => 
    axiosInstance.delete(MaterialEndpoints.DELETE_MATERIALS, {
        data: { materialsId: ids }
});