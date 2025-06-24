import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { ProductData, ProductFormInputProps } from '../type/productType';

const ProductFormInput: React.FC<ProductFormInputProps> = (props) => {
  return <FormInput<ProductData> {...props} />;
};

export default ProductFormInput;
