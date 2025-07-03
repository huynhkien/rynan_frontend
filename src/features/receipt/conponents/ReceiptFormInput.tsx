import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { ReceiptData, ReceiptFormInputProps } from '../type/receiptType';

const ReceiptFormInput: React.FC<ReceiptFormInputProps> = (props) => {
  return <FormInput<ReceiptData> {...props} />;
};

export default ReceiptFormInput;
