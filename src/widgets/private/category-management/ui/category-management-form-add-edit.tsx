'use client'
import { createCategory, getCategoryById, updateCategory } from "@/features/category/api/categoryApi";
import CategoryFormInput from "@/features/category/components/CategoryFormInput";
import { CategoryInputImage } from "@/features/category/components/CategoryInputImage";
import { CategoryData, UpdateCategory } from "@/features/category/type/categoryType";
import { Button } from "@/shared/components";
import { Box, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const CategoryManagementFormAddEdit = ({isUpdateCategory, render} : UpdateCategory) => {
    const theme = useTheme();
    const [preview, setPreview] = useState<string | null>(null);
    const { register, handleSubmit,  formState: { errors }, reset} = useForm<CategoryData>();

    // Thêm danh mục
    const handleAddCategory = async (data: CategoryData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            if (data.thumb && data.thumb.length > 0) {
                formData.append("thumb", data.thumb[0]); 
            }
            for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
            }
            const response = await createCategory(formData);
            if (!response.success) {
                toast.error(response?.message);
                reset();
                render();
                setPreview(null);
                return;
            }
            toast.success(response.message);
            reset();
            render();
            setPreview(null);
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
            reset();
            setPreview(null);
            render();
        }
    };
    // Cập nhật danh mục sản phẩm
    useEffect(() => {
    const fetchCategory = async() => {
        if(!isUpdateCategory) return;
        try {
            const response = await getCategoryById(isUpdateCategory);
            if(response.success && response.data) {
                reset({
                    name: response.data.name || '',
                    description: response.data.description || '',
                });
                setPreview(response.data.thumb?.url || '');
            }
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };
    
    fetchCategory();
}, [isUpdateCategory, reset]);
    const handleUpdateCategory = async (data: CategoryData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            if (data.thumb && data.thumb.length > 0) {
                formData.append("thumb", data.thumb[0]); 
            }
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            if(!isUpdateCategory) return;
            const response = await updateCategory(formData, isUpdateCategory);
            if (!response.success) {
                toast.error(response?.message);
                return;
            }
            toast.success(response.message);
            render();
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
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
                    {isUpdateCategory ? 'Cập nhật danh mục' : 'Thêm mới danh mục sản phẩm'}
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(isUpdateCategory ? handleUpdateCategory: handleAddCategory)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <CategoryFormInput
                    label='Tên danh mục'
                    important
                    placeholder='Thêm tên danh mục'
                    register={register as UseFormRegister<CategoryData>}
                    errors={errors as FieldErrors<CategoryData>}
                    id='name'
                    validate={{
                        required: 'Tên danh mục không được để trống',
                        minLength: {
                            value: 2,
                            message: 'Tên danh mục phải có ít nhất 2 ký tự'
                        }
                    }}
                />
                
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%'
                }}>
                    <CategoryFormInput
                        label='Mô tả'
                        important
                        placeholder='Nhập mô tả'
                        register={register}
                        errors={errors}
                        multiline
                        rows={9}
                        id='description'
                        validate={{
                            required: 'Mô tả không được để trống',
                            minLength: {
                                value: 10,
                                message: 'Mô tả phải có ít nhất 10 ký tự'
                            }
                        }}
                        sx={{
                            width: '60%'
                        }}
                    />
                    
                    <Box sx={{
                        width: '40%',
                    }}>
                        <CategoryInputImage
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
                </Box>
                
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name={isUpdateCategory ? 'Cập nhật danh mục' : 'Thêm danh mục'}
                    />
                </Box>
            </form>
        </Box>
    )
}