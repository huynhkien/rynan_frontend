import axiosInstance from "@/shared/configs/axios";
import {CategoryResponse, CategoryResponseById,  } from "../type/categoryType";
import { CategoryEndpoints } from "./categoryEndpoints";

// Thêm danh mục
export const createCategory = async (data: FormData): Promise<CategoryResponse> => 
  axiosInstance.post(CategoryEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật danh mục
export const updateCategory = async (data: FormData, id: string): Promise<CategoryResponse> => 
  axiosInstance.put(CategoryEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả danh mục
export const getAllCategory = async(): Promise<CategoryResponse> => 
    axiosInstance.get(CategoryEndpoints.GET_ALL);
// Lấy danh mục theo id
export const getCategoryById = async(id: string): Promise<CategoryResponseById> => 
    axiosInstance.get(CategoryEndpoints.GET_BY_ID(id));
// Lất danh mục theo slug
export const GetBySlug = async(slug: string): Promise<CategoryResponse> => 
    axiosInstance.get(CategoryEndpoints.GET_BY_SLUG(slug));
// Xóa danh mục
export const deleteCategory = async(id: string): Promise<CategoryResponse> => 
    axiosInstance.delete(CategoryEndpoints.DELETE(id))