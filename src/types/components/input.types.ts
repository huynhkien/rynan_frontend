// Ô input
export interface InputFormProps {
  id?: string;
  sx?: React.CSSProperties;
  value: string;
  setValue: (value: string) => void;
  nameKey: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  invalidFields?: Array<{ name: string; message: string }>;
  setInValidFields?: React.Dispatch<React.SetStateAction<Array<{ name: string; message: string }>>>;
  iconClass?: React.ReactNode;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
// Số lượng sản phẩm
export interface QuantityProps {
    quantity: number | string; 
    handleQuantity: (number: string) => void;
    handleChangeQuantity: (flag: string) => void;
}