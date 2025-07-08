import { MaterialData } from "@/features/material/type/materialType";
import { Product } from "@/features/product/type/productType";
import { Specification } from "@/features/specification/type/specificationType";
import { SupplierData } from "@/features/supplier/type/supplierType";
import { UserData } from "@/features/user/type/userTypes";
import { FormInputProps } from "@/types/components/input";

export interface ReceiptData extends Record<string, unknown> {
    _id?: string;
    staff?: string;
    status?: string;
    supplier?: string;
    products?: ReceiptProductData[];
    materials?: ReceiptMaterialData[];
    typeReceipt?: string;
    createdAt?: string | Date;
    code: string;
    note?: string;
    total: number;
    exportedTo?: string;
    approvedBy?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    produced_at?: string;
    deliveryDate?: string | Date,
    deliveryMethod?: string;
    paymentDueDate: string;
}

export interface ReceiptProductData extends Record<string, unknown> {
    pid?: string;
    name?: string;
    quantity: number;
    price?: number;
    specification?: string;
    batchNumber?: string; // Số lô hàng
    expiryDate?: string | Date, // Hạn sử dụng
    manufacturingDate?: string | Date // Ngày sản xuất


}
export interface ReceiptMaterialData extends Record<string, unknown> {
    mid?: string;
    name?: string;
    specification?: string;
    quantity: number;
    price?: number;
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
export interface ReceiptImportManagementFormAddEditMaterialProps {
    users: UserData[];
    suppliers: SupplierData[];
    supplier: SupplierData;
    handleSelectUser: (id: string | number) => void;
    handleSelectMaterial: (id: string | number) => void;
    materials: MaterialData[];
    material: MaterialData;
    specifications: Specification[];
    materialReceipt: ReceiptMaterialData[];
    receipts?: ReceiptData[];
}
export interface ReceiptImportManagementFormAddEditMaterialItemProps{
    materials?: MaterialData[];
    material?: MaterialData;
    materialId?: string;
    handleSelectMaterial?: (id: string | number) => void;
    specifications?: Specification[];
    materialReceipt?: ReceiptMaterialData[];
    isEditMaterialState?: string;
    receipt?: ReceiptData;
    render?: () => void;
}
export interface ReceiptImportManagementFormAddEditProductItemProps{
    products?: Product[];
    product?: Product;
    materialId?: string;
    handleSelectProduct?: (id: string | number) => void;
    specifications?: Specification[];
    productReceipt?: ReceiptProductData[];
    isEditProductState?: string;
    render?: () => void;
    receipt?: ReceiptData;
}
export interface ReceiptImportManagementFormAddEditProductProps {
    products: Product[];
    product: Product;
    receipts?: ReceiptData[];
    users: UserData[];
    handleSelectUser: (id: string | number) => void;
    handleSelectProduct: (id: string | number) => void;
    specifications: Specification[];
    productReceipt?: ReceiptProductData[];
    
}
export interface ReceiptImportManagementFormListMaterialItemProps {
    materialReceipt?: ReceiptMaterialData[];
    specifications: Specification[];
    materialId?: string;
    render?: () => void;
    receipt?: ReceiptData;
    action?: string
}
export interface ReceiptImportManagementFormListProductItemProps {
    productReceipt: ReceiptProductData[];
    specifications: Specification[];
    materialId?: string;
    render?: () => void;
    receipt?: ReceiptData;
    action?: string
}
export interface ReceiptApprovePendingManagementFormAddEditProps {
    users?: UserData[];
    rid?: string;
    specifications?: Specification[];
    fetchAllReceipt?: () => void;
}
export type ReceiptFormInputProps = FormInputProps<ReceiptData>;
export type ReceiptMaterialFormInputProps = FormInputProps<ReceiptMaterialData>;
export type ReceiptProductFormInputProps = FormInputProps<ReceiptProductData>;
