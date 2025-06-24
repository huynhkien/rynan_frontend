import React from 'react';
import { CategoryData, CategoryImageInputProps } from '@/features/category/type/categoryType';
import { InputImage } from '@/shared/components/ui/private/InputImage';

export const CategoryInputImage: React.FC<CategoryImageInputProps> = (props) => {
  return <InputImage<CategoryData> {...props} />;
};

