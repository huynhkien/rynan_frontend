import { ReceiptData } from "@/features/receipt/type/receiptType";

// Thống kế đơn hàng
export interface OrderStatusData {
    name: string;
    value: number;
    total: number;
    color: string;
}

export interface TooltipPayload {
    name: string;
    value: number;
    payload: OrderStatusData;
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}
// Trạng thái phiếu xuất/nhập
export interface ReceiptStatusData {
    name: string;
    value: number;
    color: string;
}
// Thống kế phiếu xuất & nhập
export interface MonthlyReceiptData {
    month: string;
    importPendingCount: number;
    importPendingTotal: number;
    importPendingQuantity: number;
    exportPendingCount: number;
    exportPendingTotal: number;
    exportPendingQuantity: number;
    importConfirmedCount: number;
    importConfirmedTotal: number;
    importConfirmedQuantity: number;
    exportConfirmedCount: number;
    exportConfirmedTotal: number;
    exportConfirmedQuantity: number;
    importCancelledCount: number;
    importCancelledTotal: number;
    importCancelledQuantity: number;
    exportCancelledCount: number;
    exportCancelledTotal: number;
    exportCancelledQuantity: number;
}

export interface CustomReceiptTooltipProps {
    active?: boolean;
    payload?: ReceiptData[];
    label?: string;
}
// Thông kế đnah giá

export interface CustomProductTooltipProps {
  active?: boolean;
  payload?: TooltipProductPayload[];
  label?: string;
}
export interface ProductStatusData {
    name: string;
    value: number;
    countRating: number;
    color: string;
}
export interface TooltipProductPayload {
    name: string;
    value: number;
    payload: ProductStatusData;
}
// Trạng thái kho hàng
export interface InventoryStatusData {
    name: string;
    value: number;
    color: string;
}
export interface TooltipInventoryPayload {
    name: string;
    value: number;
    payload: InventoryStatusData;
}
export interface CustomInventoryTooltipProps {
    active?: boolean;
    payload?: TooltipInventoryPayload[];
    label?: string;
}
// Trạng thái phiếu báo giá
export interface QuoteStatusData {
    name: string;
    value: number;
    color: string;
}
export interface TooltipQuotePayload {
    name: string;
    value: number;
    payload: QuoteStatusData;
}
export interface CustomQuoteTooltipProps {
    active?: boolean;
    payload?: TooltipInventoryPayload[];
    label?: string;
}
// doanh thu
export interface RevenueStatusData {
    name: string;
    value: number;
    color: string;
    quantity: string;
    products: { pid: string }[];

}
export interface TooltipRevenuePayload {
    name: string;
    value: number;
    payload: RevenueStatusData;
}
export interface CustomRevenueTooltipProps {
    active?: boolean;
    payload?: TooltipRevenuePayload[];
    label?: string;
}