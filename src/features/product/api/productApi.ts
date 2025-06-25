import axiosInstance from "@/shared/configs/axios";
import { ProductResponse, ProductResponseById } from "../type/productType";
import { ProductEndpoints } from "./productEndpoints";


// Thêm bai viet
export const createProduct = async (data: FormData): Promise<ProductResponseById> => 
  axiosInstance.post(ProductEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật bai viet
export const updateProduct = async (data: FormData, id: string): Promise<ProductResponse> => 
  axiosInstance.put(ProductEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Cập nhật bai viet
export const updateDescriptionProduct = async ({description, id}: {description: string; id: string;}): Promise<ProductResponse> =>
  axiosInstance.put(ProductEndpoints.UPDATE_DESCRIPTION(id), { description }, {
    withCredentials: true,
  });
// Thêm giá tiền
export const addPriceProduct = async ({prices, id}: {prices: {
        priceType: string;
        price: number;
        startDate: Date | string;
        endDate: Date | string;
        note?: string;
    }; id: string;}): Promise<ProductResponse> =>
  axiosInstance.put(ProductEndpoints.ADD_PRICE(id), { prices }, {
    withCredentials: true,
  });
// Cập nhật giá tiền
export const updatePriceProduct = async ({prices, id, rid}: {prices: {
        priceType: string;
        price: number;
        startDate: Date | string;
        endDate: Date | string;
        note?: string;
    }; id: string; rid: string}): Promise<ProductResponse> =>
  axiosInstance.put(ProductEndpoints.UPDATE_PRICE_PRODUCT(id, rid), { prices }, {
    withCredentials: true,
  });
// Xóa giá tiền
export const deletePriceProduct = async ({id, rid}: {id: string; rid: string}): Promise<ProductResponse> =>
  axiosInstance.delete(ProductEndpoints.DELETE_PRICE_PRODUCT(id, rid), {
    withCredentials: true,
  });
// Hiển thị tất cả bai viet
export const getAllProduct = async(): Promise<ProductResponse> => 
    axiosInstance.get(ProductEndpoints.GET_ALL);
// Lấy bai viet theo id
export const getProductById = async(id: string): Promise<ProductResponseById> => 
    axiosInstance.get(ProductEndpoints.GET_BY_ID(id));
// Lất bai viet theo slug
export const GetBySlug = async(slug: string): Promise<ProductResponse> => 
    axiosInstance.get(ProductEndpoints.GET_BY_SLUG(slug));
// Xóa bai viet
export const deleteProduct = async(id: string): Promise<ProductResponse> => 
    axiosInstance.delete(ProductEndpoints.DELETE(id))