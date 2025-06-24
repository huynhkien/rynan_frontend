import axiosInstance from "@/shared/configs/axios";
import { SpecificationEndpoints } from "./specificationEndpoints";
import { SpecificationData, SpecificationResponse, SpecificationResponseById } from "../type/specificationType";


// Thêm quy cách đóng gói
export const createSpecification = async (data: SpecificationData): Promise<SpecificationResponse> => 
  axiosInstance.post(SpecificationEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật quy cách đóng gói
export const updateSpecification = async (data: SpecificationData, id: string): Promise<SpecificationResponse> => 
  axiosInstance.put(SpecificationEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả quy cách đóng gói
export const getAllSpecification = async(): Promise<SpecificationResponse> => 
    axiosInstance.get(SpecificationEndpoints.GET_ALL);
// Lấy quy cách đóng gói theo id
export const getSpecificationById = async(id: string): Promise<SpecificationResponseById> => 
    axiosInstance.get(SpecificationEndpoints.GET_BY_ID(id));
// Xóa quy cách đóng gói
export const deleteSpecification = async(id: string): Promise<SpecificationResponse> => 
    axiosInstance.delete(SpecificationEndpoints.DELETE(id))