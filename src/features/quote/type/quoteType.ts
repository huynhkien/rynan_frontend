import { Product } from "@/features/product/type/productType";

export interface QuoteProductData extends Record<string, unknown> {
    pid: string;
}
export interface QuoteData {
    _id?: string;
    client: string;
    products: QuoteProductData[];
    quotation?: string;
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

