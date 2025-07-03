import { FormInputProps} from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface UpdateMaterial{
    isUpdateMaterial: string | null,
    render: () => void
}

export interface MaterialData extends Record<string, unknown> {
    name: string;
    description: string;
    code: string;
    specification: string;
    createdAt?: string | Date;
}

export interface MaterialResponse{
    success: boolean, 
    message?: string,
    data?: MaterialData[] | MaterialData;
}

export type MaterialFormInputProps = FormInputProps<MaterialData>;
