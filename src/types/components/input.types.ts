import { FieldErrors, UseFormRegister, RegisterOptions } from 'react-hook-form';

interface FormValues {
  [key: string]: string | number | boolean;
}
// Ô input
export interface InputFormProps {
  important?: boolean,
  label?: string,
  id?: string;
  sx?: React.CSSProperties;
  value?: string;
  disabled?: boolean,
  setValue?: (value: string) => void;
  nameKey?: string;
  register?: UseFormRegister<FormValues>;
  errors?: FieldErrors<FormValues>;
  type?: string;
  multiline?: boolean;
  validate?: RegisterOptions;
  defaultValue?: string;
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

// Input image
export interface InputImageProps {
  label?: string;
  onImageChange?: (file: File | null) => void;
}
