import React from 'react';
import { CategoryData, CategoryFormInputProps } from '@/features/category/type/categoryType';
import { FormInput } from '@/shared/components/ui/private/FormInput';

const CategoryFormInput: React.FC<CategoryFormInputProps> = (props) => {
  return <FormInput<CategoryData> {...props} />;
};

export default CategoryFormInput;
