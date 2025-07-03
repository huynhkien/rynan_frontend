import { FormInputProps} from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateSupplier{
    isUpdateSupplier: string | null,
    render: () => void
}

export interface SupplierDataAddress {
    province: 
    {
        code: number,
        name: string
    },
    district: {
        code: number,
        name: string
    },
    ward: {
        code: number,
        name: string
    },
    detail: string,
    addressAdd: string
}
interface BankAccount {
    bank_name: string;
    account_number: string;
}
export interface SupplierData extends Record<string, unknown> {
    _id?: string;
    name: string;
    note: string;
    code: string;
    createdAt?: string | Date;
    contact_person: string;
    phone: string;
    email: string;
    tax_code: string;
    isActive: string;
    address: SupplierDataAddress;
    bank_account: BankAccount;
}

export interface SuppliersResponse{
    success: boolean, 
    message?: string,
    data?: SupplierData[] ;
}
export interface SupplierResponse{
    success: boolean, 
    message?: string,
    data?: SupplierData ;
}

export type SupplierFormInputProps = FormInputProps<SupplierData>;
