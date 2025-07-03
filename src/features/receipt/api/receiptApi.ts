import axiosInstance from "@/shared/configs/axios";
import { ReceiptEndpoints } from "./receiptEndpoints";
import { ReceiptData, ReceiptProductData, ReceiptResponse, ReceiptsResponse } from "../type/receiptType";

// Thêm phiếu nhập hàng 
export const createReceiptImport = async (data: ReceiptData): Promise<ReceiptResponse> => 
  axiosInstance.post(ReceiptEndpoints.CREATE_IMPORT_RECEIPT, data, {
    withCredentials: true,
    
});
// Thêm phiếu xuất hàng
export const createReceiptExport = async (data: ReceiptData): Promise<ReceiptResponse> => 
  axiosInstance.post(ReceiptEndpoints.CREATE_EXPORT_RECEIPT, data, {
    withCredentials: true,
    
});
// Hiển thị tất cả phiếu
export const getAllReceipt = async(): Promise<ReceiptsResponse> => 
    axiosInstance.get(ReceiptEndpoints.GET_ALL);
// Lấy phiếu theo id
export const getReceiptById = async(id: string): Promise<ReceiptResponse> => 
    axiosInstance.get(ReceiptEndpoints.GET_BY_ID(id));
// Cập nhật phiếu
export const updateReceipt = async (data: ReceiptData, id: string): Promise<ReceiptResponse> => 
  axiosInstance.put(ReceiptEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
// Cập nhật sản phẩm trong phiếu
export const updateProductReceipt = async (data: ReceiptProductData, id: string, pid: string): Promise<ReceiptResponse> => 
  axiosInstance.put(ReceiptEndpoints.UPDATE_PRODUCT_RECEIPT(id, pid), data, {
    withCredentials: true,
});
// Xóa phiếu
export const deleteReceipt = async(id: string): Promise<ReceiptResponse> => 
    axiosInstance.delete(ReceiptEndpoints.DELETE(id))
// Xóa sản phẩm trong phiếu
export const deleteProductReceipt = async(id: string, pid: string): Promise<ReceiptResponse> => 
    axiosInstance.delete(ReceiptEndpoints.DELETE_PRODUCT_RECEIPT(id, pid))