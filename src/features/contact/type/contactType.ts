import { FormInputProps } from "@/types/components/input";

export type Order = 'asc' | 'desc';
export interface ContactData extends Record<string, unknown> {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    message: string;
    createdAt?: string | Date;
    status?: string;
}
export interface MailData extends Record<string, unknown>{
    email: string;
    subject: string;
    html: string;
}

export interface ContactResponse{
    success: boolean, 
    message?: string,
    data?: ContactData[]
}
export interface ContactResponseById{
    success: boolean;
    data: ContactData;
}
export type ContactFormInputProps = FormInputProps<ContactData>;
export type MailFormInputProps = FormInputProps<MailData>;
