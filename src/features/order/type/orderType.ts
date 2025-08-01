import { Product } from "@/features/product/type/productType";
import { OrderProductItem } from "@/features/user/type/userTypes";
import { FormInputProps } from "@/types/components/input";



export interface OrderData extends Record<string, unknown> {
    _id?: string;
    status: string;
    orderBy: string;
    location?: OrderLocationData;
    products: OrderProductData[];
    total: number;
    paymentMethod?: string;
    paymentStatus?: string;
    note?: string;
    staff?: string;
    expectedDeliveryDate?: string | Date;
    paymentDueDate?: string | Date;
    createdAt?: string | Date;
    code: string;
    orderType?: string;
}
export interface OrderRecipientData {
    name: string;
    phone: string;
    address: string;
}
export interface OrderLocationData {
    lat: number;
    lng: number;
}
export interface OrderStatusData extends Record<string, unknown> {
    staff: string;
    status: string;
    location:OrderLocationData,
}
interface OrderProductData {
    pid?: string;
    name: string;
    quantity: number;
    price: number;
    priceType?: string;
    thumb: string;

}
export interface OrderResponse {
    success: boolean;
    message?: string;
    data?: OrderData;
    paymentUrl?: string
}
export interface OrdersResponse {
    success: boolean;
    message?: string;
    data?: OrderData[];
    paymentUrl?: string
}
//
export interface OrderManagementFormAddProductProps {
    handleSelectionChangeProduct?: (id: string  | number) => void;
    products?: Product[];
    product?: Product;
    orderProducts?: OrderProductItem[],
    edit?: string;
    oid?: string;
    pid?: string;
    order?: OrderData;
    render?: () => void;
}
export interface OrderProductProps {
    orderProduct: OrderProductItem[];
    id?: string;
    edit?: string
    productsData?: Product[];
    oid?: string;
    renderOrder?: () => void;
    action?: string
}
export interface VnPayRefundData extends Record<string, unknown>{
    status: string;
    _id: string;
    transType: string;
    amount: number;
    user: string;
}
export type OrderFormInputProps = FormInputProps<OrderData>;
export type OrderStatusFormInputProps = FormInputProps<OrderStatusData>;
export type OrderRefundFormInputProps = FormInputProps<VnPayRefundData>
