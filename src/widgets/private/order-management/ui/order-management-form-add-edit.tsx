'use client'

import OrderFormInput from "@/features/order/components/OrderFormInput";
import { OrderData } from "@/features/order/type/orderType";
import { getAllUser, getUserById } from "@/features/user/api/userApis";
import { UserData } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { CustomerGender, OrderStatus } from "@/shared/constant/common";
import { Box, Typography, useTheme, Button, Paper } from "@mui/material"
import moment from "moment";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";

export const OrderManagementFormAddEdit = () => {
    const { register, formState: { errors }, reset, control } = useForm<OrderData>();
    const theme = useTheme();
    // Lấy id khi có cập nhật thông tin
    const {id} = useParams();
    console.log(id)
    // State cho nhân viên
    const [staff, setStaff] = useState<UserData[]>();
    // State cho khách hàng
    const [users, setUsers] = useState<UserData[]>();
    const [user, setUser] = useState<UserData | null>(null);
    // State lựa chọn khách hàng
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    // Hiển thị thông tin nhân viên
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getAllUser();
            if(response.success && response.data){
                const filteredStaff = response.data.filter((el) => ['2002', '2004', '2006'].includes(el.role || ''));
                const filteredUser = response.data.filter((el) => ['2000'].includes(el.role || ''));
                setStaff(filteredStaff);
                setUsers(filteredUser);
            }
        }
        fetchUsers();
    },[]);
    // Xử lý lựa chọn khách hàng
    const handleSelectionChangeUser = (id: string | number) => {
        setSelectedUser(id as string)
    }
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
        <Box sx={{ display: 'flex', gap: 1, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant='body1' sx={{ fontWeight: 500, minWidth: '80px' }}>
            {label}:
          </Typography>
          <Typography variant='body1' sx={{ color: theme.palette.text.primary }}>
            {value || 'Trống'}
          </Typography>
        </Box>
    );
    
    return (
        <Box sx={{ mb: 2,  borderRadius: 0,  }}>
            {/* Form */}
            <form>
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
                                    <Button sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                        <Typography>Tạo mã</Typography>
                                    </Button>
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
                                        important
                                        sx={{ width: '50%' }}
                                        name='staff'
                                        control={control}
                                        options={staff?.map((el) => ({
                                            _id: el._id,
                                            name: el.name
                                        })) || []}
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
                                <OrderFormInput
                                    label='Ghi chú'
                                    important
                                    placeholder='Ghi chú'
                                    register={register as UseFormRegister<OrderData>}
                                    errors={errors as FieldErrors<OrderData>}
                                    id='note'
                                    multiline
                                    rows={5}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
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
                                    name='staff'
                                    control={control}
                                    options={users?.map((el) => ({
                                        _id: el._id,
                                        name: el.name
                                    })) || []}
                                    rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                                />
                                <Box sx={{ mt: 2 }}>
                                <UserInfoRow label='Họ và tên' value={user?.name} />
                                <UserInfoRow label='Giới tính' value={CustomerGender.find((el) => el._id === user?.gender)?.name} />
                                <UserInfoRow label='SĐT' value={user?.phone} />
                                <UserInfoRow label='Email' value={user?.email} />
                                <UserInfoRow label='Địa chỉ' value={user?.address?.detail} />
                                <UserInfoRow label='Ngày sinh' value={moment(user?.dateOfBirth).format('DD/MM/YYYY')} />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                                <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                    Thêm sản phẩm
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
                                    <Button sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                        <Typography>Tạo mã</Typography>
                                    </Button>
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
                                        important
                                        sx={{ width: '50%' }}
                                        name='staff'
                                        control={control}
                                        options={staff?.map((el) => ({
                                            _id: el._id,
                                            name: el.name
                                        })) || []}
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
                                <OrderFormInput
                                    label='Ghi chú'
                                    important
                                    placeholder='Ghi chú'
                                    register={register as UseFormRegister<OrderData>}
                                    errors={errors as FieldErrors<OrderData>}
                                    id='note'
                                    multiline
                                    rows={5}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </Box>
                        </Paper>
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
                                    <Button sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                        <Typography>Tạo mã</Typography>
                                    </Button>
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
                                        important
                                        sx={{ width: '50%' }}
                                        name='staff'
                                        control={control}
                                        options={staff?.map((el) => ({
                                            _id: el._id,
                                            name: el.name
                                        })) || []}
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
                                <OrderFormInput
                                    label='Ghi chú'
                                    important
                                    placeholder='Ghi chú'
                                    register={register as UseFormRegister<OrderData>}
                                    errors={errors as FieldErrors<OrderData>}
                                    id='note'
                                    multiline
                                    rows={5}
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                {/* Submit buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => reset()}>
                        Reset Form
                    </Button>
                    <Button type="submit" variant="contained">
                        Lưu thông tin
                    </Button>
                </Box>
            </form>
        </Box>
    );
};