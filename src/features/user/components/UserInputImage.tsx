import React from 'react';
import { InputImage } from '@/shared/components/ui/private/InputImage';
import { UserDataProps, UserImageInputProps } from '../type/userTypes';

export const UserInputImage: React.FC<UserImageInputProps> = (props) => {
  return <InputImage<UserDataProps> {...props} />;
};

