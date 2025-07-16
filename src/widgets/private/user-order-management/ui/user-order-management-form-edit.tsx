'use client'
import { getOrderById, updateStatusOrderByUser } from '@/features/order/api/orderApi';
import OrderFormInput from '@/features/order/components/OrderFormInput';
import { OrderData } from '@/features/order/type/orderType';
import { Button } from '@/shared/components';
import { ControlledSelect } from '@/shared/components/ui/private/ControlledSelect';
import { OrderStatus, PaymentMethods, PaymentStatuses } from '@/shared/constant/common';
import { useAppDispatch } from '@/shared/hooks/useAppHook';
import { showModal } from '@/shared/store/appSlice';
import { Box, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';

export const UserOrderManagementFormEdit = ({orderId, render}: {orderId: string, render: () => void;}) => {
    const theme = useTheme();
    const { register, handleSubmit,  formState: { errors }, control, reset} = useForm<OrderData>();
    const [order, setOrder] = useState<OrderData>();
    const dispatch = useAppDispatch();
    // Hiển thị chi tiết đơn hàng
    useEffect(() => {
        if(!orderId) return;
        const fetchOrder = async() => {
            const response = await getOrderById(orderId);
            if(response.success){
                reset({
                    code: response.data?.code,
                    paymentMethod: PaymentMethods.find(el => el._id === response.data?.paymentMethod)?.name,
                    paymentStatus: PaymentStatuses.find(el => el._id === response.data?.paymentStatus)?.name,
                    status: response.data?.status
                });
                setOrder(response.data);
            }
        }
        fetchOrder();
    },[orderId, reset]);
    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async(data: OrderData) => {
        try{
            dispatch(showModal({isShowModal: true, modalType: 'loading'}))
            const response = await updateStatusOrderByUser(data.status, orderId);
            if(response.success){
                dispatch(showModal({isShowModal: false, modalType: null}))
                toast.success(response.message);
                render();
            }
        }catch(error: unknown){
            dispatch(showModal({isShowModal: false, modalType: null}))
            const errorMessage = (error as Error).message || 'Lỗi không xác định';
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
                    Cập nhật trạng thái đơn hàng
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(handleUpdateStatus)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <OrderFormInput
                    label='Mã đơn hàng'
                    important
                    placeholder='Mã đơn hàng'
                    disabled
                    register={register as UseFormRegister<OrderData>}
                    errors={errors as FieldErrors<OrderData>}
                    id='code'
                />
                <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2}}>
                    <OrderFormInput
                        label='Hình thức thanh toán'
                        important
                        disabled
                        placeholder='Hình thức thanh toán'
                        register={register as UseFormRegister<OrderData>}
                        errors={errors as FieldErrors<OrderData>}
                        id='paymentMethod'
                        sx={{width: '50%'}}
                    />
                    <OrderFormInput
                        label='Trạng thái thanh toán'
                        important
                        disabled
                        placeholder='Trạng thái thanh toán'
                        register={register as UseFormRegister<OrderData>}
                        errors={errors as FieldErrors<OrderData>}
                        id='paymentStatus'
                        sx={{width: '50%'}}
                    />
                </Box>
                {order?.status === 'Processing' ?
                    <ControlledSelect
                        label='Trạng thái đơn hàng'
                        placeholder='Lựa chọn trạng thái đơn hàng'
                        important
                        sx={{ width: '100%' }}
                        name='status'
                        control={control}
                        options={OrderStatus.filter(el => ['Processing', 'Cancelled'].includes(el._id))}
                        rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
                    />
                : order?.status === 'Cancelled'  ?
                    <OrderFormInput
                        label='Trạng thái đơn hàng'
                        important
                        disabled
                        placeholder='Trạng thái đơn hàng'
                        register={register as UseFormRegister<OrderData>}
                        errors={errors as FieldErrors<OrderData>}
                        id='status'
                        defaultValue={'Đã hủy đơn'}
                        sx={{width: '50%'}}
                    />
                :
                    <ControlledSelect
                        label='Trạng thái đơn hàng'
                        placeholder='Lựa chọn trạng thái đơn hàng'
                        important
                        sx={{ width: '100%' }}
                        name='status'
                        control={control}
                        options={OrderStatus.filter(el => ['Received' ,'Succeed'].includes(el._id))}
                        rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
                    />
            }
                
                <Box sx={{ mt:3 }}>
                    <Button 
                        name='Cập nhật'
                    />
                </Box>
            </form>
        </Box>
    )
}