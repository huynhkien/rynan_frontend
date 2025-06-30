import { SxProps, Theme } from "@mui/material";
import { FieldErrors, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

// Ô input dành cho login, contact
export interface BaseInputProps {
  id?: string;
  style?: string;
  value: string;
  multiline?: boolean;
  setValue: (value: string) => void;
  nameKey: string;
  rows?:number;
  type?: string;
  invalidFields?: Array<{ name: string; message: string }>;
  setInValidFields?: React.Dispatch<React.SetStateAction<Array<{ name: string; message: string }>>>;
  iconClass?: React.ReactNode;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
// Ô input dành cho react hook form
export interface FormInputProps<TFormValues extends Record<string, unknown>> {
  id: Path<TFormValues>;
  label?: string;
  important?: boolean;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  validate?: RegisterOptions<TFormValues, Path<TFormValues>>;
  placeholder?: string;
  defaultValue?: string | number;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
}
// Số lượng sản phẩm
export interface QuantityProps {
    quantity: number | string; 
    handleQuantity: (number: string) => void;
    handleChangeQuantity: (flag: string) => void;
}

// Input image
export interface InputImageProps<TFormValues extends Record<string, unknown>> {
  id: Path<TFormValues>;
  label?: string;
  register: UseFormRegister<TFormValues>;
  validate?: RegisterOptions<TFormValues, Path<TFormValues>>;
  errors: FieldErrors<TFormValues>;
  onImageChange?: (file: File | null) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
}
