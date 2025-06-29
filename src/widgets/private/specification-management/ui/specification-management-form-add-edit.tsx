'use client'
import { createSpecification, getSpecificationById, updateSpecification } from "@/features/specification/api/specificationApi";
import SpecificationFormInput from "@/features/specification/components/SpecificationFormInput";
import { SpecificationData, UpdateSpecification } from "@/features/specification/type/specificationType";

import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { SpecificationType } from "@/shared/constant/common";
import { Box, Typography, useTheme } from "@mui/material"
import { useEffect, } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const SpecificationManagementFormAddEdit = ({isUpdateSpecification, render} : UpdateSpecification) => {
    const theme = useTheme();
    const { register, handleSubmit,  formState: { errors }, reset, control} = useForm<SpecificationData>();

    // Thêm quy cách
    const handleAddSpecification = async (data: SpecificationData) => {
        try {
            const response = await createSpecification(data);
            if (!response.success) {
                toast.error(response?.message);
                reset();
                render();
                return;
            }
            toast.success(response.message);
            reset();
            render();
        } catch (error: unknown) {
            toast.error(`Lỗi: ${error}`);
            reset();
            render();
        }
    };
    // Cập nhật quy cách sản phẩm
    useEffect(() => {
    const fetchSpecification = async() => {
        if(!isUpdateSpecification) return;
        try {
            const response = await getSpecificationById(isUpdateSpecification);
            if(response.success && response.data) {
                reset({
                    code: response.data.code || '',
                    name: response.data.name || '',
                    unit: response.data.unit || '',
                    conversionQuantity: response.data.conversionQuantity || '',
                    packagingWeight: response.data.packagingWeight || '',
                    height: response.data.height || '',
                    width: response.data.width || '',
                    length: response.data.length || '',
                    description: response.data.description || '',
                    type: response.data.type || '',
                });
            }
        } catch (error) {
            console.error('Error fetching Specification:', error);
        }
    };
    
    fetchSpecification();
}, [isUpdateSpecification, reset]);
    const handleUpdateSpecification = async (data: SpecificationData) => {
        try {
            if(!isUpdateSpecification) return;
            const response = await updateSpecification(data, isUpdateSpecification);
            if (!response.success) {
                toast.error(response?.message);
                return;
            }
            toast.success(response.message);
            render();
        } catch (error: unknown) {
            toast.error(`Lỗi: ${error}`);
        }
    }

    return (
        <Box
            sx={{
                width: '100%'
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
                    {isUpdateSpecification ? 'Cập nhật quy cách' : 'Thêm mới quy cách'}
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(isUpdateSpecification ? handleUpdateSpecification: handleAddSpecification)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <SpecificationFormInput
                        label='Mã quy cách'
                        important
                        placeholder='Thêm mã quy cách'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='code'
                        validate={{
                            required: 'Tên mã quy cách không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên mã quy cách phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{
                            width: '50%'
                        }}
                    />
                    <SpecificationFormInput
                        label='Tên quy cách'
                        important
                        placeholder='Thêm tên quy cách'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='name'
                        validate={{
                            required: 'Tên tên quy cách không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên mã quy cách phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{
                            width: '50%'
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
                    <SpecificationFormInput
                        label='Đơn vị tính'
                        important
                        placeholder='Thêm đơn vị tính'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='unit'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <SpecificationFormInput
                        label='Số lượng quy đổi'
                        important
                        placeholder='Thêm số lượng quy đổi'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='conversionQuantity'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ControlledSelect
                        label='Lựa chọn loại quy cách'
                        important
                        sx={{ width: '50%' }}
                        name='type'
                        control={control}
                        options={SpecificationType}
                        rules={{ required: 'Vui lòng chọn loại quy cách' }}
                        searchable={true}
                    />
                    
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <SpecificationFormInput
                        label='Khối lượng'
                        important
                        placeholder='Thêm khối lượng đóng gói'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='packagingWeight'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <SpecificationFormInput
                        label='Chiều cao'
                        important
                        placeholder='Thêm chiều cao'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='height'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <SpecificationFormInput
                        label='Chiều dài'
                        important
                        placeholder='Thêm chiều dài'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='length'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <SpecificationFormInput
                        label='Chiều rộng'
                        important
                        placeholder='Thêm chiều rộng'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='width'
                        sx={{
                            width: '50%'
                        }}
                    />
                </Box>
                <Box>
                    <SpecificationFormInput
                        label='Mô tả(nếu có)'
                        important
                        placeholder='Thêm mô tả'
                        register={register as UseFormRegister<SpecificationData>}
                        errors={errors as FieldErrors<SpecificationData>}
                        id='description'
                    />
                </Box>
                
                
                <Box sx={{ mt: 3 }}>
                    <Button 
                        name={isUpdateSpecification ? 'Cập nhật quy cách' : 'Thêm quy cách'}
                    />
                </Box>
            </form>
        </Box>
    )
}