import axiosInstance from "@/shared/configs/axios";
import { ProductParams, ProductRatingProps, ProductRatingsRepliesData, ProductResponse, ProductResponseById } from "../type/productType";
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
export const updatePriceProduct = async ({updatePrice, id, rid}: {updatePrice: {
        priceType: string;
        price: number;
        startDate: Date | string;
        endDate: Date | string;
        note?: string;
    }; id: string; rid: string}): Promise<ProductResponse> =>
  axiosInstance.put(ProductEndpoints.UPDATE_PRICE_PRODUCT(id, rid), { updatePrice }, {
    withCredentials: true,
});
// Cập nhật giá tiền
export const addUpdatePriceProduct = async ({updatePrice, id}: {updatePrice: {
        priceType: string;
        price: number;
        startDate: Date | string;
        endDate: Date | string;
        note?: string;
    }; id: string}): Promise<ProductResponse> =>
  axiosInstance.put(ProductEndpoints.ADD_UPDATE_PRICE_PRODUCT(id), { updatePrice }, {
    withCredentials: true,
});
// Xóa giá tiền
export const deletePriceProduct = async ({id, rid}: {id: string; rid: string}): Promise<ProductResponse> =>
  axiosInstance.delete(ProductEndpoints.DELETE_PRICE_PRODUCT(id, rid), {
    withCredentials: true,
  });
// Hiển thị tất cả bai viet
export const getAllProduct = async ( params? : ProductParams): Promise<ProductResponse> => 
    axiosInstance.get(ProductEndpoints.GET_ALL, {
        params,
        withCredentials: true, 
    });
// Lấy bai viet theo id
export const getProductById = async(id: string): Promise<ProductResponseById> => 
    axiosInstance.get(ProductEndpoints.GET_BY_ID(id));
// Lất bai viet theo slug
export const GetProductBySlug = async(slug: string): Promise<ProductResponseById> => 
    axiosInstance.get(ProductEndpoints.GET_BY_SLUG(slug));
// Xóa bai viet
export const deleteProduct = async(id: string): Promise<ProductResponse> => 
    axiosInstance.delete(ProductEndpoints.DELETE(id));
// Thêm đánh giá
export const addRating = async (data: ProductRatingProps): Promise<ProductResponseById> => 
  axiosInstance.put(ProductEndpoints.ADD_RATING, data, {
    withCredentials: true,
});
// Xóa đánh giá
export const deleteRating = async(id: string, rid: string): Promise<ProductResponse> => 
    axiosInstance.delete(ProductEndpoints.DELETE_RATING(id, rid));
// Thêm phản hồi
export const addReply = async(id: string, rid: string, data: ProductRatingsRepliesData): Promise<ProductResponse> => 
  axiosInstance.post(ProductEndpoints.ADD_REPLY(id, rid), data, {
    withCredentials: true
});
export const addReplyChild = async(id: string, cid: string, data: ProductRatingsRepliesData): Promise<ProductResponse> => 
  axiosInstance.post(ProductEndpoints.ADD_REPLY_CHILD(id, cid), data, {
    withCredentials: true
});
// Xóa phản hồi
export const deleteReply = async(id: string, rid: string, repId: string): Promise<ProductResponse> => 
    axiosInstance.delete(ProductEndpoints.DELETE_REPLY(id, rid, repId));
// Xóa nhiều sản phẩm
export const deleteProducts = async (ids: string[]): Promise<ProductResponse> => 
    axiosInstance.delete(ProductEndpoints.DELETE_PRODUCTS, {
        data: { productsId: ids }
});