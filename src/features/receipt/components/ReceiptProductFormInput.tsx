import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { ReceiptProductData, ReceiptProductFormInputProps } from '../type/receiptType';

const ReceiptProductFormInput: React.FC<ReceiptProductFormInputProps> = (props) => {
  return <FormInput<ReceiptProductData> {...props} />;
};

export default ReceiptProductFormInput;
