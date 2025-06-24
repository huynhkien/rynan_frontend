import React from 'react';
import { InputImage } from '@/shared/components/ui/private/InputImage';
import { ProductData, ProductImageInputProps } from '../type/productType';

export const ProductInputImage: React.FC<ProductImageInputProps> = (props) => {
  return <InputImage<ProductData> {...props} />;
};

