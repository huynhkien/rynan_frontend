import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { UserDataProps, UserFormInputProps } from '../type/userTypes';

const UserFormInput: React.FC<UserFormInputProps> = (props) => {
  return <FormInput<UserDataProps> {...props} />;
};

export default UserFormInput;
