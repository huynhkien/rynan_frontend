import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { InventoryData, InventoryFormInputProps } from '../type/inventoryType';

const InventoryFormInput: React.FC<InventoryFormInputProps> = (props) => {
  return <FormInput<InventoryData> {...props} />;
};

export default InventoryFormInput;
