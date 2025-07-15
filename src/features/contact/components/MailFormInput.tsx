import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { MailData, MailFormInputProps } from '../type/contactType';

const MailFormInput: React.FC<MailFormInputProps> = (props) => {
  return <FormInput<MailData> {...props} />;
};

export default MailFormInput;
