import { FormInputProps } from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateSpecification{
    isUpdateSpecification: string | null,
    render: () => void
}
export interface Specification {
    _id: string;
    code: string;
    name: string;
    unit: string;
    conversionQuantity: string;
    packagingWeight: string;
    height: string;
    length: string;
    width: string;
    updatedAt: Date;
    createdAt: Date;
    description?: string;
}
export interface SpecificationData extends Record<string, unknown> {
    code: string;
    name: string;
    unit: string;
    conversionQuantity: string;
    packagingWeight: string;
    height: string;
    length: string;
    width: string;
    description?: string;
}

export interface SpecificationResponse{
    success: boolean, 
    message?: string,
    data?: Specification[]
}
export interface SpecificationResponseById{
    success: boolean;
    data: Specification;
}
export type SpecificationFormInputProps = FormInputProps<SpecificationData>;
