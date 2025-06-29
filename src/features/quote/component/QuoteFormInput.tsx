import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import {  QuoteFormInputProps, QuoteProductData } from '../type/quoteType';

const QuoteFormInput: React.FC<QuoteFormInputProps> = (props) => {
  return <FormInput<QuoteProductData> {...props} />;
};

export default QuoteFormInput;
