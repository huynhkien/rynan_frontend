export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceFilterProps {
  initialMin?: number;
  initialMax?: number;
  minRange?: number;
  maxRange?: number;
  onFilter?: (priceRange: PriceRange) => void;
  currency?: string;
}