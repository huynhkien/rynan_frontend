import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { ContactData, ContactFormInputProps } from '../type/contactType';

const ContactFormInput: React.FC<ContactFormInputProps> = (props) => {
  return <FormInput<ContactData> {...props} />;
};

export default ContactFormInput;
