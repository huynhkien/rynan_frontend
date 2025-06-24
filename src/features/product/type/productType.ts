import { FormInputProps, InputImageProps } from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateProduct{
    isUpdateProduct: string | null,
    render: () => void
}
interface ProductThumb{
    url: string;
    public_id?: string;
}

export interface Product {
    _id: string;
    code: string,
    name_vn: string;
    name_eng: string;
    name_short: string;
    thumb: ProductThumb;
    description: string;
    category: string;
    sold: string;
    tags: string;
    price_reference: number;
    specification: string;
    origin: string;
    slug: string;
    isActive: string;
    updatedAt: string;
    createdAt: string;
}
export interface ProductData extends Record<string, unknown> {
    name_vn: string;
    name_eng: string;
    code: string,
    name_short: string;
    thumb: FileList;
    description: string;
    category: string;
    sold: string;
    isActive: string;
    tags: string;
    price_reference: number;
    specification: string;
    origin: string;
}

export interface ProductResponse{
    success: boolean, 
    message?: string,
    data?: Product[]
}
export interface ProductResponseById{
    success: boolean;
    data: Product;
}
export type ProductFormInputProps = FormInputProps<ProductData>;
export type ProductImageInputProps = InputImageProps<ProductData>;
