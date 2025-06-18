export interface QuantityProps {
    quantity: number | string; 
    handleQuantity: (number: string) => void;
    handleChangeQuantity: (flag: string) => void;
}