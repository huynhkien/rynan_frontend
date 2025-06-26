import { Category } from "@/features/category/type/categoryType";
import { Specification } from "@/features/specification/type/specificationType";
import { FormInputProps, InputImageProps } from "@/types/components/input";
import { SxProps, Theme } from "@mui/material";
import { FieldErrors, Path, RegisterOptions, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type Order = 'asc' | 'desc';
export interface UpdateProduct{
    isUpdateProduct: string | null,
    render: () => void
}
export interface UpdatePriceProduct{
    isUpdatePriceProduct: string | null,
    render: () => void
}
interface ProductThumb{
    url: string;
    public_id?: string;
}
interface ProductTags{
    _id?: string;
    tag: string;
}
export interface Product {
    _id: string;
    code: string,
    name_vn: string;
    name_eng: string;
    name_short: string;
    thumb: ProductThumb;
    images: ProductThumb[];
    description: string;
    category: string;
    sold: string;
    tags: ProductTags[];
    price_reference: number;
    specification: string;
    origin: string;
    slug: string;
    isActive: string;
    updatedAt: string;
    createdAt: string;
    prices: PriceProduct[];
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
    tags: ProductTags[];
    price_reference: number;
    specification: string;
    origin: string;
    
}
export interface ProductCardData {
    name_vn: string;
    category: string;
    price_reference: number;
    thumb: ProductThumb;
    slug: string;
}
export interface ProductPrice extends Record<string, unknown> {
    productId?: string;
    priceType: string;
    price: number;                       
    startDate: Date | string;                   
    endDate: Date | string;                     
    note: string;                  
}
export interface PriceProduct {
    _id: string;
    priceType: string;
    price: number;                       
    startDate: Date | string;                   
    endDate: Date | string;                     
    note: string;
}
export interface ProductParams {
    q?: string,
    sort?: string;
    page?: string;
    limit?: number;
    price_gte?: number | string;
    price_lte?: number | string;
}
export interface ProductPriceData {
    id: string,
    product: Product;
    render: () => void;
}
export interface ProductResponse{
    success: boolean; 
    message?: string;
    data?: Product[];
    counts?: number;
}
export interface ProductResponseById{
    success: boolean;
    message?: string,
    data: Product;
}
export interface ProductTagsInputProps {
  label: string;
  important?: boolean;
  placeholder?: string;
  register: UseFormRegister<ProductData>;
  errors: FieldErrors<ProductData>;
  setValue: UseFormSetValue<ProductData>;
  watch: UseFormWatch<ProductData>;
  id: Path<ProductData>;
  validate?: RegisterOptions<ProductData, Path<ProductData>>;
  sx?: SxProps<Theme>;
}

export type ProductFormInputProps = FormInputProps<ProductData>;
export type ProductPriceInputProps = FormInputProps<ProductPrice>;
export type ProductImageInputProps = InputImageProps<ProductData>;


// 
export interface MarkdownEditorProps {
    id?: string;
    value: string;
    changeValue: (value: string) => void;
    handleUpdate: () => void;
 
}

// 
export interface ProductManagementFormAddInfoProps{
    category: Category[];
    specification: Specification[];
    preview: string | null;
    setPreview: (preview: string | null) => void;
    handleAddProduct: (data: ProductData) => void;

}
export interface ProductManagementFormEditInfoProps{
    id: string
    category: Category[];
    specification: Specification[];
    preview: string | null;
    setPreview: (preview: string | null) => void;
    handleAddProduct: (data: ProductData) => void;

}
