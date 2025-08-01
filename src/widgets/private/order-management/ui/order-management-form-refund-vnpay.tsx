'use client'

import { getOrderById, vnPayRefund } from "@/features/order/api/orderApi";
import OrderRefundFormInput from "@/features/order/components/OrderRefundFormInput";
import {  VnPayRefundData } from "@/features/order/type/orderType";
import { getAllUser } from "@/features/user/api/userApis";
import { UserData } from "@/features/user/type/userTypes";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { TransType } from "@/shared/constant/common";
import { Box, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";


export const OrderManagementFormRefundVnPay = ({_id} : {_id: string}) => {
    const theme = useTheme();
    const { register, handleSubmit,  formState: { errors },  control, setValue} = useForm<VnPayRefundData>();
    const [users, setUsers] = useState<UserData[] | []>([]);
    // Hiển thị thông tin đơn hàng
    const fetchOrder = useCallback(async() => {
        if(!_id) return;
        const response = await getOrderById(_id);
        if(response.success) {
            setValue('amount', response.data?.total as number);
        }
    },[_id, setValue])
    useEffect(() => {
        fetchOrder();
    },[fetchOrder])
    // Hiển thị thông tin nhân viên
    const fetchUsers = useCallback(async() => {
        const response = await getAllUser();
        if(response.success){
            const filteredStaff = response.data.filter(el => ['2002','2004','2006'].includes(el.role as string));
            if(filteredStaff) setUsers(filteredStaff);
        }
    },[]);
    useEffect(() => {
        fetchUsers();
    },[fetchUsers])
    const handleRefundVnPay = async(data: VnPayRefundData) =>{
        const dataOrder = {
            ...data,
            _id
        }
        try{
            const response = await vnPayRefund(dataOrder);
            toast.success(response.message);
            fetchOrder();
        }catch(error: unknown){
            const errorMessage = (error as Error).message;
            toast.error(errorMessage);
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Box sx={{
                backgroundColor: theme.palette.primary.light,
                py: 2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold
            }}>
                <Typography variant='body2'>
                    Hoàn tiền giao dịch với VNPAY
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(handleRefundVnPay)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <OrderRefundFormInput
                    label='Số tiền hoàn'
                    type='number'
                    important
                    placeholder='Nhập số tiền hoàn'
                    register={register as UseFormRegister<VnPayRefundData>}
                    errors={errors as FieldErrors<VnPayRefundData>}
                    id='amount'
                />
                <ControlledSelect
                    label='Kiểu hoàn tiền'
                    important
                    name='transType'
                    control={control}
                    options={TransType}
                    rules={{
                        required: 'Vui lòng chọn kiểu hoàn tiền'
                    }}
                />
                <ControlledSelect
                    label='Nhân viên thực hiện'
                    important
                    name='user'
                    control={control}
                    options={users}
                    rules={{
                        required: 'Vui lòng chọn nhân viên thực hiện'
                    }}
                />
                <OrderRefundFormInput
                    label='Trạng thái'
                    important
                    register={register as UseFormRegister<VnPayRefundData>}
                    errors={errors as FieldErrors<VnPayRefundData>}
                    id='status'
                    disabled
                    defaultValue={'Hủy Đơn hàng'}
                />
                
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name='Hoàn tiền giao dịch'
                    />
                </Box>
            </form>
        </Box>
    )
}