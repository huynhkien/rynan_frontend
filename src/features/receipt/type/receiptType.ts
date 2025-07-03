import { FormInputProps } from "@/types/components/input";

export interface ReceiptData extends Record<string, unknown> {
    _id?: string;
    handleBy?: string;
    status: string;
    products: ReceiptProductData[];
    typeReceipt: string;
    createdAt?: string | Date;
    code: string;
    note?: string;
    total: number;
    exportedTo: string;
    approvedBy: string;
}

export interface ReceiptProductData {
    pid?: string;
    name?: string;
    quantity?: number;
    price?: number;
    priceType?: string;
    thumb?: string;
    batchNumber?: string; // Số lô hàng
    expiryDate?: string | Date, // Hạn sử dụng
    manufacturingDate?: string | Date // Ngày sản xuất

}
export interface ReceiptResponse {
    success: boolean;
    message?: string;
    data?: ReceiptData
}
export interface ReceiptsResponse {
    success: boolean;
    message?: string;
    data?: ReceiptData[];
}
export type ReceiptFormInputProps = FormInputProps<ReceiptData>;
