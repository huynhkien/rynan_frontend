import axiosInstance from "@/shared/configs/axios";
import { QuoteEndpoints } from "./quoteEndpoints";
import { QuoteData, QuoteResponse, QuotesResponse } from "../type/quoteType";

// Thêm báo giá
export const createQuote = async (data: QuoteData): Promise<QuoteResponse> => 
  axiosInstance.post(QuoteEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật báo giá
export const updateQuote = async (data: QuoteData, id: string): Promise<QuoteResponse> => 
  axiosInstance.put(QuoteEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả báo giá
export const getAllQuote = async(): Promise<QuotesResponse> => 
    axiosInstance.get(QuoteEndpoints.GET_ALL);
// Lấy báo giá theo id
export const getQuoteById = async(id: string): Promise<QuoteResponse> => 
    axiosInstance.get(QuoteEndpoints.GET_BY_ID(id));
// Xóa báo giá
export const deleteQuote = async(id: string): Promise<QuoteResponse> => 
    axiosInstance.delete(QuoteEndpoints.DELETE(id))
// Xóa sản phẩm báo giá
export const deleteProductQuote = async(id: string, pid: string): Promise<QuoteResponse> => 
    axiosInstance.delete(QuoteEndpoints.DELETE_PRODUCT_QUOTE(id, pid))

// Xóa nhiều báo giá
export const deleteQuotes = async (ids: string[]): Promise<QuoteResponse> => 
    axiosInstance.delete(QuoteEndpoints.DELETE_QUOTES, {
        data: { quotesId: ids }
});
