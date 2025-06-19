export interface Option {
  id: number;
  value: string;
  text: string;
}

export interface SelectProps {
  value: string | number;
  changeValue: (value: string | number) => void;
  options: Option[];
}