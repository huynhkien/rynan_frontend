import { FormInputProps } from "@/types/components/input";

interface approvalHistory {
    approvedBy: string;
    approvedAt: string | Date;
    action: string;
    quantityChange: string;
    previousStock: string;
    newStock: string;
    notes: string;
    _id: string;
}
export interface InventoryData extends Record<string, unknown> {
    _id?: string;
    rid?: string;
    productId?:string;
    materialId?:string;
    currentStock?: string;
    status?: string;
    type?: string;
    approvedBy?: string;
    products?: InventoryProductData[];
    materials?: InventoryMaterialData[];
    createdAt?: string | Date;
    location?: InventoryLocationData;
    approvalHistory?:approvalHistory[];
}
export interface InventoryProductData  {
    pid?: string;
    name?: string;
    quantity: number;
    price?: number;
    specification?: string;
    batchNumber?: string; // Số lô hàng
    expiryDate?: string | Date; // Hạn sử dụng
    manufacturingDate?: string | Date; // Ngày sản xuất
    location?: InventoryLocationData;
}
export interface InventoryMaterialData  {
    mid?: string;
    name?: string;
    specification?: string;
    quantity: number;
    price?: number;
    batchNumber?: string; // Số lô hàng
    expiryDate?: string | Date // Hạn sử dụng
    manufacturingDate?: string | Date; // Ngày sản xuất
    location?: InventoryLocationData;
}
interface InventoryLocationData {
    shelf: string;
    positionCode: string;
}

export interface InventoryResponse {
    success?: boolean;
    message?:  string;
    data?: InventoryData[];
}



export type InventoryFormInputProps = FormInputProps<InventoryData>;
