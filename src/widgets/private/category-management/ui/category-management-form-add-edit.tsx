'use client'
import { createCategory } from "@/features/category/api/categoryApi";
import CategoryFormInput from "@/features/category/components/CategoryFormInput";
import { CategoryInputImage } from "@/features/category/components/CategoryInputImage";
import { CategoryData, UpdateCategory } from "@/features/category/type/categoryType";
import { Button } from "@/shared/components";
import { Box, Typography, useTheme } from "@mui/material"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const CategoryManagementFormAddEdit = ({isUpdateCategory, setIsUpdateCategory} : UpdateCategory) => {
    const theme = useTheme();
    const { register, handleSubmit,  formState: { errors }} = useForm<CategoryData>();

    const handleAddCategory = async(data: CategoryData) => {
        try{
            const payload = {
                name: data.name,
                description: data.description,
                thumb: data.thumb
            }
            console.log(payload)
            const response = await createCategory(payload)
            if(!response.success){
                toast.error(response?.message);
            }
            setIsUpdateCategory(null)
            toast.success(response.message)
        }catch(error: unknown){
            toast.error(`Lỗi: ${error}`)
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
                    {isUpdateCategory ? 'Cập nhật danh mục' : 'Thêm mới danh mục sản phẩm'}
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(handleAddCategory)}
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
                    sx={{
                        width: '750px'
                    }}
                />
                
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
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
                            width: '450px'
                        }}
                    />
                    
                    <Box sx={{
                        width: '300px',
                    }}>
                        <CategoryInputImage
                            id='thumb'
                            validate={{
                            required: 'Ảnh không được để trống',
                            }}
                            register={register}
                            errors={errors}
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