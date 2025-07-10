import { Product } from "@/features/product/type/productType";

export interface QuoteProductData extends Record<string, unknown> {
    pid: string;
}
export interface QuoteData {
    _id?: string;
    client: string;
    products: QuoteProductData[];
    quotation?: string;
    createdAt?: Date | string;
}

export interface QuoteResponse {
    success: boolean,
    data?: QuoteData,
    message?: string
}
export interface QuotesResponse {
    success: boolean,
    data?: QuoteData[],
    message?: string
}
export interface QuoteFormProductList {
    product: Product[];
    render: () => void;
    id?: string;
}

export interface UserProductInfoProps {
    pid: string;
    name: string;
    totalQuantity: number;
}
export interface UserOrderInfoProps {
    id: string;
    name: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    orderProductQuantity: number;
    userProductInfo: UserProductInfoProps[],
    orderTotal: number;
    createdAt: string | Date;
    lastOrder?: string | Date;
}

