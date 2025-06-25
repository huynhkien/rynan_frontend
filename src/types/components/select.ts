import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

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
export interface OptionPrivate {
  _id?: string;
  name?: string;
  name_vn?: string;
}

export interface SelectPrivateProps {
  value: string | number;
  changeValue: (value: string | number) => void;
  options: OptionPrivate[];
  label?: string;
  important?: boolean;
  placeholder?: string; 
  sx?: SxProps<Theme>;
}

export interface ControlledSelectProps<T extends FieldValues> extends Omit<SelectPrivateProps, 'value' | 'changeValue'> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
}
