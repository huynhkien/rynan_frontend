'use client'

import OrderFormInput from '@/features/order/components/OrderFormInput';
import { OrderData } from '@/features/order/type/orderType';
import { getAllProduct, getProductById } from '@/features/product/api/productApi';
import { Product } from '@/features/product/type/productType';
import { getAllUser, getUserById } from '@/features/user/api/userApis';
import { OrderProductItem, UserData } from '@/features/user/type/userTypes';
import { ControlledSelect } from '@/shared/components/ui/private/ControlledSelect';
import { CustomerGender, OrderStatus, PaymentMethods, PaymentStatuses } from '@/shared/constant/common';
import { Box, Typography, useTheme, Button, Paper, Divider } from '@mui/material'
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { OrderManagementFormAddEditProduct } from './order-management-form-add-edit-product';
import { OrderManagementFormListProduct } from './order-management-form-list-product';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { createOrder, getAllOrder, getOrderById, updateOrder } from '@/features/order/api/orderApi';
import { toast } from 'react-toastify';
import { removeAllOrderProduct } from '@/features/user/store/userSlice';

export const OrderManagementFormAddEdit = () => {
    const { register, formState: { errors }, reset, control, handleSubmit, setValue} = useForm<OrderData>();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    // Lấy id khi có cập nhật thông tin
    const {id} = useParams();
    // State cho nhân viên
    const [staff, setStaff] = useState<UserData[] | []>([]);
    const {orderProduct} = useAppSelector((state) => state.user);
    // State quản lý mã đơn
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);
    // State quản lý đơn hàng
    const [orders, setOrders] = useState<OrderData[]>();
    const [orderData, setOrderData] = useState<OrderData>();
    // State cho san pham
    const [product, setProduct] = useState<Product>();
    const [productOrder, setProductOrder] = useState<OrderProductItem[]>();
    const [products, setProducts] = useState<Product[]>();
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    // State cho khách hàng
    const [users, setUsers] = useState<UserData[]>();
    const [user, setUser] = useState<UserData | null>(null);
    // State lựa chọn khách hàng
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    // Hiển thị thông tin nhân viên & sản phẩm
    const fetchOrders = async () => {
        const response = await getAllOrder();
        if(response.success) setOrders(response.data);
    }
    const fetchUsers = async () => {
            const response = await getAllUser();
            if(response.success && response.data){
                const filteredStaff = response.data.filter((el) => ['2002', '2004', '2006'].includes(el.role || ''));
                const filteredUser = response.data.filter((el) => ['2000'].includes(el.role || ''));
                setStaff(filteredStaff);
                setUsers(filteredUser);
            }
        }
        const fetchProducts = async () => {
            const response = await getAllProduct();
            if(response.success) setProducts(response.data);
        }
    useEffect(() => {
        fetchUsers();
        fetchProducts();
        fetchOrders();
    },[]);
    // Hiển thị thông tin chi tiết sản phẩm
    useEffect(() => {
        if(!selectedProduct) return;
        const fetchProduct = async () => {
            const response = await getProductById(selectedProduct as string);
            if(response.success) setProduct(response.data);
        }
        fetchProduct();
    },[selectedProduct]);
    // Xử lý lựa chọn khách hàng
    const handleSelectionChangeUser = (id: string | number) => {
        setSelectedUser(id as string)
    }
    // Xử lý lựa chọn sản phẩm
    const handleSelectionChangeProduct = (id: string | number) => {
        setSelectedProduct(id as string);
    }

    // Tạo mã đơn
    const handleGenerateCode = useCallback(() => {
        if (orders?.length === 0) {
            setValue('code', 'RYNAN25-01');
            setLastCodeNumber(1);
            return;
        }
        
        let newNumber = lastCodeNumber + 1;
        let newCode = `RYNAN25-0${newNumber}`;
        
        while (orders?.some((el) => el.code === newCode)) {
            newNumber += 1;
            newCode = `RYNAN25-0${newNumber}`;
        }
        
        setLastCodeNumber(newNumber);
        setValue('code', newCode);
    }, [orders, lastCodeNumber, setValue]);

    useEffect(() => {
        const fetchUser = async () => {
          if (!selectedUser) return;
          const response = await getUserById(selectedUser);
          if (response.success) setUser(response.data || null);
          console.log(response.data);
        };
        fetchUser();
    }, [selectedUser]);
    // Hiển thị thông tin khách hàng
    const UserInfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
        <Box sx={{ display: 'flex', gap: 1, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant='body1' sx={{ fontWeight: 500, minWidth: '80px' }}>
            {label}:
          </Typography>
          <Typography variant='body1' sx={{ color: theme.palette.text.primary }}>
            {value || 'Trống'}
          </Typography>
        </Box>
    );
    // Tính tổng đơn hàng
    const totalOrder = orderProduct.reduce((sum, item) => {
        return sum + (item.quantity * (item.price as number))
    }, 0);
    // Xử lý tạo đơn hàng
    const handleCreateOrder = async (OrderData: OrderData) => {
        try{
            const newOrderData = {
                code: OrderData.code,
                products: orderProduct,
                status: OrderData.status,
                orderBy: selectedUser,
                total: totalOrder,
                paymentMethod: OrderData.paymentMethod,
                paymentStatus: OrderData.paymentStatus,
                paymentDueDate: OrderData.paymentDueDate,
                note: OrderData.note,
                staff: OrderData.staff,
                expectedDeliveryDate: OrderData.expectedDeliveryDate
            }
            const response = await createOrder(newOrderData as OrderData);
            if(response.success){
                dispatch(removeAllOrderProduct());
                toast.success(response.message);
                setSelectedUser(null);
                setSelectedProduct(null);
                reset();
            }
        }catch(error: unknown){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }
    // Cập nhật thông tin đơn hàng
    const fetchOrder = useCallback(async () => {
        if(!id) return;
        const response = await getOrderById(id as string);
        if(response.success && response.data) {
            setOrderData(response.data);
            reset({
                code: response.data.code || '',
                status: response.data.status || '',
                staff: response.data.staff || '',
                expectedDeliveryDate: (response.data.expectedDeliveryDate as string).split('T')[0] || '',
                paymentStatus: response.data.paymentStatus || '',
                paymentMethod: response.data.paymentMethod || '',
                paymentDueDate: (response.data.paymentDueDate as string).split('T')[0] || '',
                note: response.data.note || ''
            });
            setValue('orderBy', response.data.orderBy || '');
            setSelectedUser(response.data.orderBy);
            setProductOrder(response.data.products as OrderProductItem[]);
        }
    }, [id, reset, setValue]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);
    // Cập nhật lại tôi đơn hàng
    const orderProductTotal =productOrder?.reduce((sum, item) => {
        return sum + ((item.price as number )* item.quantity)
    },0);
    const orderTotalUpdate = totalOrder + (orderProductTotal as number);
    const handleUpdateOrder = async (data: OrderData) => {
        const mergedProductsData = [...productOrder as OrderProductItem[], ...orderProduct];
        const temp: Record<string, OrderProductItem> = {};
        mergedProductsData.forEach((item) => {
            if(temp[item.pid]) {
                temp[item.pid].quantity += item.quantity;
            } else {
                temp[item.pid] = {...item};
            }
        });
        const productsData = Object.values(temp);
        try{
            const newOrderData = {
                code: data.code,
                products: productsData,
                status: data.status,
                orderBy: selectedUser,
                total: totalOrder,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                paymentDueDate: data.paymentDueDate,
                note: data.note,
                staff: data.staff,
                expectedDeliveryDate: data.expectedDeliveryDate
            }
            console.log(newOrderData);
            const response = await updateOrder(newOrderData as OrderData, id as string);
            if(response.success) {
                toast.success(response.message);
                dispatch(removeAllOrderProduct());
                fetchOrder();
            }
        }catch(error: unknown){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage);
            fetchOrder();
        }
    }
    return (
        <Box sx={{ mb: 2,  borderRadius: 0,  }}>
            {/* Form */}
            <form onSubmit={handleSubmit(
                id ? handleUpdateOrder : handleCreateOrder,
            )}>
                <Box >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                                <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                    Thông tin đơn hàng
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                                {/* Mã đơn hàng */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        
                                    }}
                                >
                                    {id ? 
                                    (
                                        <OrderFormInput
                                            label='Mã đơn hàng'
                                            important
                                            disabled
                                            placeholder='Thêm mã khách hàng'
                                            register={register as UseFormRegister<OrderData>}
                                            errors={errors as FieldErrors<OrderData>}
                                            id='code'
                                            validate={{ required: 'Mã đơn hàng không được để trống' }}
                                            sx={{
                                                width: '100%'
                                            }}
                                        />
                                    )
                                    :
                                    (
                                        <>
                                        <OrderFormInput
                                            label='Mã đơn hàng'
                                            important
                                            placeholder='Thêm mã khách hàng'
                                            register={register as UseFormRegister<OrderData>}
                                            errors={errors as FieldErrors<OrderData>}
                                            id='code'
                                            validate={{ required: 'Mã đơn hàng không được để trống' }}
                                            sx={{
                                                width: '70%'
                                            }}
                                        />
                                        <Button onClick={handleGenerateCode} sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                            <Typography>Tạo mã</Typography>
                                        </Button>
                                        </>
                                    )   
                                    }
                                    
                                </Box>
                                <ControlledSelect
                                    label='Trạng thái đơn hàng'
                                    important
                                    sx={{ width: '100%' }}
                                    name='status'
                                    control={control}
                                    options={OrderStatus}
                                    rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
                                />
                                <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                                    <ControlledSelect
                                        label='Nhân viên xử lý'
                                        placeholder='Lựa chọn nhân viên xử lý'
                                        important
                                        sx={{ width: '50%' }}
                                        name='staff'
                                        control={control}
                                        options={staff}
                                        rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
                                    />
                                    <OrderFormInput
                                        label='Ngày dự kiến giao hàng'
                                        type='date'
                                        important
                                        register={register as UseFormRegister<OrderData>}
                                        errors={errors as FieldErrors<OrderData>}
                                        id='expectedDeliveryDate'
                                        validate={{ required: 'Ngày dự kiến giao hàng không được để trống' }}
                                        sx={{
                                            width: '50%'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                        <Paper sx={{ width: '50%', display: 'flex', borderRadius: 0, flexDirection: 'column', gap: 1, backgroundColor: theme.palette.background.default }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                    Thông tin liên hệ
                                </Typography>
                            </Box>
                            <Box
                                sx={{p:2}}
                            >
                                <ControlledSelect
                                    label='Khách hàng'
                                    onSelectionChange={handleSelectionChangeUser}
                                    important
                                    sx={{ width: '100%' }}
                                    name='orderBy'
                                    control={control}
                                    options={users?.map((el) => ({
                                        _id: el._id,
                                        name: el.name
                                    })) || []}
                                    rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                                />
                                <Box sx={{ mt: 1 }}>
                                <UserInfoRow label='Họ và tên' value={user?.name} />
                                <UserInfoRow label='Giới tính' value={CustomerGender.find((el) => el._id === user?.gender)?.name} />
                                <UserInfoRow label='SĐT' value={user?.phone} />
                                <UserInfoRow label='Email' value={user?.email} />
                                <UserInfoRow label='Địa chỉ' value={user?.address?.detail} />
                                <UserInfoRow label='Ngày sinh' value={moment(user?.dateOfBirth).format('DD/MM/YYYY')} />
                                <UserInfoRow label='Mã số thuế' value={user?.tax_code as string} />
                                <UserInfoRow label='Thông tin xuất hóa đơn' value={user?.invoice_address as string} />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                            <OrderManagementFormAddEditProduct
                                handleSelectionChangeProduct={handleSelectionChangeProduct}
                                product={product as Product}
                                products={products as Product[]}
                                orderProducts={orderProduct}
                                order={orderData}
                            />
                        </Paper>
                        <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                                <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                    Danh sách sản phẩm
                                </Typography>
                            </Box>
                            <OrderManagementFormListProduct orderProduct={orderProduct}/>
                        </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ 
                            width: '50%', 
                            borderRadius: 0, 
                            backgroundColor: theme.palette.background.default 
                        }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant='body2' sx={{ 
                                    color: theme.palette.primary.main, 
                                    mx: 2, 
                                    fontWeight: 'bold' 
                                }}>
                                    Thông tin thanh toán
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                                {/* Tóm tắt đơn hàng */}
                                <Box>
                                    <Typography variant='body1' sx={{ mb: 1, fontWeight: 'bold' }}>
                                        Tóm tắt đơn hàng
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Tạm tính:
                                        </Typography>
                                        <Typography variant='body1'>
                                            {id ? orderTotalUpdate.toLocaleString() : totalOrder.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Phí vận chuyển:
                                        </Typography>
                                        <Typography variant='body1'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Giảm giá:
                                        </Typography>
                                        <Typography variant='body1' color='success.main'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Thuế (VAT 10%):
                                        </Typography>
                                        <Typography variant='body1'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant='body2' fontWeight='bold'>
                                            Tổng cộng:
                                        </Typography>
                                        <Typography variant='body2' fontWeight='bold' color='primary.main'>
                                            {id ? orderTotalUpdate.toLocaleString() : totalOrder.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                </Box>
                                {/* Trạng thái thanh toán */}
                                <ControlledSelect
                                    label='Trạng thái thanh toán'
                                    important
                                    name='paymentStatus'
                                    control={control}
                                    options={PaymentStatuses}
                                    rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
                                />

                                {/* Hình thức thanh toán */}
                                <ControlledSelect
                                    label='Hình thức thanh toán'
                                    important
                                    name='paymentMethod'
                                    control={control}
                                    options={PaymentMethods}
                                    rules={{ required: 'Vui lòng chọn hình thức thanh toán' }}
                                />
                                {/* Hạn thanh toán */}
                                <OrderFormInput
                                    label='Hạn thanh toán'
                                    type='date'
                                    important
                                    register={register as UseFormRegister<OrderData>}
                                    errors={errors as FieldErrors<OrderData>}
                                    id='paymentDueDate'
                                    validate={{ required: 'Hạn thanh toán không được để trống' }}
                                />
                                {/* Ghi chú */}
                                <OrderFormInput
                                    label='Ghi chú'
                                    type='5'
                                    important
                                    register={register as UseFormRegister<OrderData>}
                                    errors={errors as FieldErrors<OrderData>}
                                    id='note'
                                    multiline
                                    rows={10}
                                />
                            </Box>
                        </Paper>
                        {id && (
                            <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                                <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                                    <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                        Danh sách sản phẩm tồn tại trong giỏ hàng
                                    </Typography>
                                </Box>
                                <OrderManagementFormListProduct orderProduct={productOrder as OrderProductItem[]} productsData={products}  edit='true' oid={id as string} renderOrder={fetchOrder}/>
                            </Paper>
                        )}
                    </Box>
                </Box>

                {/* Submit buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant='outlined' onClick={() => reset()}>
                        Reset Form
                    </Button>
                    <Button type='submit' variant='contained'>
                        Lưu thông tin
                    </Button>
                </Box>
            </form>
        </Box>
    );
};