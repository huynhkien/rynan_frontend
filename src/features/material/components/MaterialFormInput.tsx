import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { MaterialData, MaterialFormInputProps } from '../type/materialType';

const MaterialFormInput: React.FC<MaterialFormInputProps> = (props) => {
  return <FormInput<MaterialData> {...props} />;
};

export default MaterialFormInput;
