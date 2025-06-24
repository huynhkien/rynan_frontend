import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { SpecificationData, SpecificationFormInputProps } from '../type/specificationType';

const SpecificationFormInput: React.FC<SpecificationFormInputProps> = (props) => {
  return <FormInput<SpecificationData> {...props} />;
};

export default SpecificationFormInput;
