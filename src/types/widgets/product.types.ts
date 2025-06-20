// Đánh giá sản phẩm
export interface ProductDetailRatingVoteProps {
    number: number;
    ratingCount: number;
    ratingTotal: number;
}
// Giá sản phẩm
export interface ProductPriceRange {
  min: number;
  max: number;
}

export interface ProductPriceFilterProps {
  initialMin?: number;
  initialMax?: number;
  minRange?: number;
  maxRange?: number;
  onFilter?: (priceRange: ProductPriceRange) => void;
  currency?: string;
}
// Sắp xếp sản phẩm
export interface ProductOption {
  id: number;
  value: string;
  text: string;
}

export interface ProductSortProps {
  value: string | number;
  changeValue: (value: string | number) => void;
  options: ProductOption[];
}