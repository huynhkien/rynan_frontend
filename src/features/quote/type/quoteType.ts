import { Product } from "@/features/product/type/productType";
import { FormInputProps } from "@/types/components/input";

export interface QuoteProductData extends Record<string, unknown> {
    _id: string;
    name_vn: string;
    priceType: string;
    price: number;
    endDate: string | Date;
    startDate: string | Date;
}
export interface QuoteData {
    client: string;
    products: QuoteProductData[] | QuoteData;
}

export interface QuoteResponse {
    success: boolean,
    data?: QuoteData | string,
    message?: string
}
export interface QuotesResponse {
    success: boolean,
    data?: QuoteData[] | string,
    message?: string
}
export interface QuoteFormProductList {
    product: Product[];
    render: () => void;
    isEditProduct: boolean;
    setIsEditProduct: (isEditProduct: boolean) => void
}

export type QuoteFormInputProps = FormInputProps<QuoteProductData>;
