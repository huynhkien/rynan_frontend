import { Specification } from "@/features/specification/type/specificationType";
import { FormInputProps} from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateMaterial{
    isUpdateMaterial: string | null,
    render: () => void;
    specification: Specification[];
}

export interface MaterialData extends Record<string, unknown> {
    _id?: string;
    name: string;
    name_short: string;
    note: string;
    code: string;
    specification: string;
    createdAt?: string | Date;
}

export interface MaterialsResponse{
    success: boolean, 
    message?: string,
    data?: MaterialData[];
}
export interface MaterialResponse{
    success: boolean, 
    message?: string,
    data?: MaterialData;
}

export type MaterialFormInputProps = FormInputProps<MaterialData>;
