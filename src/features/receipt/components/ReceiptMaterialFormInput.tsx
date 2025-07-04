import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import {  ReceiptMaterialData, ReceiptMaterialFormInputProps } from '../type/receiptType';

const ReceiptMaterialFormInput: React.FC<ReceiptMaterialFormInputProps> = (props) => {
  return <FormInput<ReceiptMaterialData> {...props} />;
};

export default ReceiptMaterialFormInput;
