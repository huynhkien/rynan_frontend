import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { OrderStatusData, OrderStatusFormInputProps } from '../type/orderType';

const OrderStatusFormInput: React.FC<OrderStatusFormInputProps> = (props) => {
  return <FormInput<OrderStatusData> {...props} />;
};

export default OrderStatusFormInput;
