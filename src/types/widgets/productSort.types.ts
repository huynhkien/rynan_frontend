export interface Option {
  id: number;
  value: string;
  text: string;
}

export interface ProductSortProps {
  value: string | number;
  changeValue: (value: string | number) => void;
  options: Option[];
}