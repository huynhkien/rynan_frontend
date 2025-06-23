import React from 'react';
import { CategoryData, CategoryFormInputProps } from '@/features/category/type/categoryType';
import { InputImage } from '@/shared/components/ui/private/InputImage';

export const CategoryInputImage: React.FC<CategoryFormInputProps> = (props) => {
  return <InputImage<CategoryData> {...props} />;
};

