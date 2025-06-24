import { FormInputProps, InputImageProps } from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateCategory{
    isUpdateCategory: string | null,
    render: () => void
}
interface CategoryThumb{
    url: string;
    public_id?: string;
}
export interface Category {
    _id: string;
    name: string;
    thumb: CategoryThumb;
    description: string;
    slug: string;
    updatedAt: string;
    createdAt: string;
}
export interface CategoryData extends Record<string, unknown> {
    name: string;
    thumb: FileList;
    description: string;
}

export interface CategoryResponse{
    success: boolean, 
    message?: string,
    data?: Category[]
}
export interface CategoryResponseById{
    success: boolean;
    data: Category;
}
export type CategoryFormInputProps = FormInputProps<CategoryData>;
export type CategoryImageInputProps = InputImageProps<CategoryData>;
