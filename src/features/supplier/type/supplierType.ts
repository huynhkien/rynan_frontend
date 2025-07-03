import { FormInputProps} from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateSupplier{
    isUpdateSupplier: string | null,
    render: () => void
}

export interface SupplierData extends Record<string, unknown> {
    name: string;
    description: string;
    code: string;
    specification: string;
    createdAt?: string | Date;
}

export interface SupplierResponse{
    success: boolean, 
    message?: string,
    data?: SupplierData[] | SupplierData;
}

export type SupplierFormInputProps = FormInputProps<SupplierData>;
