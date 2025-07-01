import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { OrderData, OrderFormInputProps } from '../type/orderType';

const OrderFormInput: React.FC<OrderFormInputProps> = (props) => {
  return <FormInput<OrderData> {...props} />;
};

export default OrderFormInput;
