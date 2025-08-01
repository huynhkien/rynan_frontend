import React from 'react';
import { FormInput } from '@/shared/components/ui/private/FormInput';
import { OrderRefundFormInputProps, VnPayRefundData } from '../type/orderType';

const OrderRefundFormInput: React.FC<OrderRefundFormInputProps> = (props) => {
  return <FormInput<VnPayRefundData> {...props} />;
};

export default OrderRefundFormInput;
