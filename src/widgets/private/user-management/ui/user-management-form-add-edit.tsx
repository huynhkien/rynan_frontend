'use client'

import UserFormInput from "@/features/user/components/UserFormInput";
import { UserInputImage } from "@/features/user/components/UserInputImage";
import { UserDataProps } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { CustomerGender, CustomerSource, CustomerType } from "@/shared/constant/common";
import { Box, Paper, Typography, useTheme } from "@mui/material"
import { useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";


export const UserManagementFormAddEdit = () => {
    const { register,   formState: { errors }, control} = useForm<UserDataProps>();
    const theme = useTheme();
    const [preview, setPreview] = useState<string | null>(null);

    // Hàm thêm sản phẩm
    // const handleAddProduct = async (data: UserDataProps) => {
    //     try {
            
    //         if (data.thumb && data.thumb.length > 0) {
    //             formData.append("thumb", data.thumb[0]);
    //         }

    //         const response = await createProduct(formData);
    //         if (!response.success) {
    //             toast.error(response.message);
    //             return;
    //         }

    //         toast.success(response.message);
    //         setPreview(null);
    //         reset();
    //         setProductId(response.data._id);
    //     } catch (error: unknown) {
    //         toast.error(`Lỗi: ${error}`);
    //         setPreview(null);
    //         reset();
    //     }
    // };



    return (
        <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.default , }}>
            <Box sx={{ py: 2 }}>
                <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>
                    Thêm thông tin khách
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex', justifyContent: 'space-between', width: '100%', gap: 5
                }}
            >
                <Box
                sx={{
                    width: '50%'
                }}
            >
                <Box sx={{ py: 2 }}>
                    <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                        Thông tin khách
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}
                >
                    <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Typography>Ảnh đại diện</Typography>
                        <UserInputImage
                            id='thumb'
                            validate={{
                            required: 'Ảnh không được để trống',
                            }}
                            register={register}
                            errors={errors}
                            preview={preview}
                            setPreview={setPreview}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <ControlledSelect
                            label='Loại khách'
                            important
                            sx={{
                                width: '50%'
                            }}
                            name='type'
                            control={control}
                            options={CustomerType}
                            rules={{
                            required: 'Vui lòng chọn loại khách',
                            }}/>
                        <ControlledSelect
                            label='Nguồn khách'
                            important
                            sx={{
                                width: '50%'
                            }}
                            name='source'
                            control={control}
                            options={CustomerSource}
                            rules={{
                            required: 'Vui lòng chọn nguồn khách',
                            }}/>
                        
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='Mã khách hàng'
                            important
                            placeholder='Thêm mã khách hàng'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='code'
                            sx={{
                                width: '70%'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='Ngày sinh'
                            important
                            type='date'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='dateOfBirth'
                            sx={{
                                width: '50%'
                            }}
                        />
                        <ControlledSelect
                            label='Giới tính'
                            important
                            sx={{
                                width: '50%'
                            }}
                            name='gender'
                            control={control}
                            options={CustomerGender}
                            rules={{
                            required: 'Vui lòng chọn giới tính',
                            }}/>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='CCCD'
                            important
                            placeholder='Thêm cccd'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='identification_card'
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='Mã số thuế'
                            important
                            placeholder='Thêm mã số thuế'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='tax_code'
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='Website'
                            important
                            placeholder='Website'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='website'
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='Địa chỉ xuất hóa đơn'
                            important
                            placeholder='Thêm địa chỉ xuất hóa đơn'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='invoice_address'
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <UserFormInput
                            label='Ghi chú(nếu có)'
                            important
                            placeholder='Thêm ghi chú'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='note'
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    </Box>
                </Box>
                <Box
                sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                <Box sx={{ py: 2 }}>
                    <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                        Thông tin liên hệ
                    </Typography>
                </Box>
                <Box
                    sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                >
                    <Box>
                        <ControlledSelect
                            label='Nhân viên phụ trách'
                            important
                            sx={{
                                width: '100%'
                            }}
                            name='staff'
                            control={control}
                            options={CustomerType}
                            rules={{
                            required: 'Vui lòng chọn tên nhân viên',
                            }}
                        />
                        
                    </Box>
                    <Box>
                        <UserFormInput
                            label='Số điện thoại'
                            important
                            placeholder='Thêm số điện thoại'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='name_vn'
                            validate={{
                                required: 'Tên số điện thoại không được để trống',
                                minLength: {
                                    value: 2,
                                    message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
                                }
                            }}
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box>
                        <UserFormInput
                            label='Email'
                            important
                            placeholder='Thêm số email'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='email'
                            validate={{
                                required: 'Tên số email không được để trống',
                                minLength: {
                                    value: 2,
                                    message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
                                }
                            }}
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box>
                        <UserFormInput
                            label='Email'
                            important
                            placeholder='Thêm số email'
                            register={register as UseFormRegister<UserDataProps>}
                            errors={errors as FieldErrors<UserDataProps>}
                            id='email'
                            validate={{
                                required: 'Tên số email không được để trống',
                                minLength: {
                                    value: 2,
                                    message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
                                }
                            }}
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            </Box>
            
        </Paper>
    );
};
