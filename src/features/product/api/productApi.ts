
import axiosInstance from "@/shared/configs/axios";
import { ProductResponse, ProductResponseById } from "../type/productType";
import { ProductEndpoints } from "./productEndpoints";


// Thêm danh mục
export const createProduct = async (data: FormData): Promise<ProductResponse> => 
  axiosInstance.post(ProductEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật danh mục
export const updateProduct = async (data: FormData, id: string): Promise<ProductResponse> => 
  axiosInstance.put(ProductEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả danh mục
export const getAllProduct = async(): Promise<ProductResponse> => 
    axiosInstance.get(ProductEndpoints.GET_ALL);
// Lấy danh mục theo id
export const getProductById = async(id: string): Promise<ProductResponseById> => 
    axiosInstance.get(ProductEndpoints.GET_BY_ID(id));
// Lất danh mục theo slug
export const GetBySlug = async(slug: string): Promise<ProductResponse> => 
    axiosInstance.get(ProductEndpoints.GET_BY_SLUG(slug));
// Xóa danh mục
export const deleteProduct = async(id: string): Promise<ProductResponse> => 
    axiosInstance.delete(ProductEndpoints.DELETE(id))