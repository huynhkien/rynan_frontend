import { FormInputProps } from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateCategory{
    isUpdateCategory: number | null,
    setIsUpdateCategory: (isUpdateCategory: number | null) => void
}
export interface CategoryData extends Record<string, unknown> {
    name: string;
    thumb: File;
    description: string;
}
export interface Data {
    name: string;
    thumb: string;
    description: string;
}
export interface CategoryResponse{
    success: boolean, 
    message?: string,
    data?: string
}
export type CategoryFormInputProps = FormInputProps<CategoryData>;
