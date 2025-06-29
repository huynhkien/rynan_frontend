import axiosInstance from "@/shared/configs/axios";
import { QuoteEndpoints } from "./quoteEndpoints";
import { QuoteResponse, QuotesResponse } from "../type/quoteType";

// Thêm danh mục
export const createQuote = async (data: FormData): Promise<QuoteResponse> => 
  axiosInstance.post(QuoteEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Cập nhật danh mục
export const updateQuote = async (data: FormData, id: string): Promise<QuoteResponse> => 
  axiosInstance.put(QuoteEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Hiển thị tất cả danh mục
export const getAllQuote = async(): Promise<QuotesResponse> => 
    axiosInstance.get(QuoteEndpoints.GET_ALL);
// Lấy danh mục theo id
export const getQuoteById = async(id: string): Promise<QuoteResponse> => 
    axiosInstance.get(QuoteEndpoints.GET_BY_ID(id));
// Xóa danh mục
export const deleteQuote = async(id: string): Promise<QuoteResponse> => 
    axiosInstance.delete(QuoteEndpoints.DELETE(id))