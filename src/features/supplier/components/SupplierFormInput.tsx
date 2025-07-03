import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { SupplierData, SupplierFormInputProps } from '../type/supplierType';

const SupplierFormInput: React.FC<SupplierFormInputProps> = (props) => {
  return <FormInput<SupplierData> {...props} />;
};

export default SupplierFormInput;
