import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { ProductPrice, ProductPriceInputProps } from '../type/productType';

const ProductInputPrice: React.FC<ProductPriceInputProps> = (props) => {
  return <FormInput<ProductPrice> {...props} />;
};

export default ProductInputPrice;
