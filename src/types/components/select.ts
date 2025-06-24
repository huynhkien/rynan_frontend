import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";

export interface Option {
  id: number;
  value: string;
  text: string;
}

export interface SelectProps {
  value: string | number;
  changeValue: (value: string | number) => void;
  options: Option[] ;
  label?: string;
  important?: boolean;
  sx?: SxProps<Theme>;
}


export interface ControlledSelectProps<T extends FieldValues> extends Omit<SelectProps, 'value' | 'changeValue'> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
}
