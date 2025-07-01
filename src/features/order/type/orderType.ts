import { FormInputProps } from "@/types/components/input";

export interface OrderData extends Record<string, unknown> {
    _id?: string;
    status: string;
    orderBy: string;
    location?: OrderLocationData;
    products: OrderProductData[];
    total: number;
    payment?: string;
    note?: string;
    staff?: string;
    expectedDeliveryDate?: string | Date
    recipient: OrderRecipientData;
    createdAt?: string | Date

}
interface OrderRecipientData {
    name: string;
    phone: string;
    address: string;
}
interface OrderLocationData {
    lat: number;
    lng: number;
}
interface OrderProductData {
    pid?: string;
    name: string;
    quantity: number;
    price: number;
    thumb: string;

}
export interface OrderResponse {
    success: boolean;
    message?: string;
    data?: OrderData
}
export interface OrdersResponse {
    success: boolean;
    message?: string;
    data?: OrderData[];
}

export type OrderFormInputProps = FormInputProps<OrderData>;
