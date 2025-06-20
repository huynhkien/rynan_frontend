'use client'
import { Button } from "@/shared/components";
import { InputForm } from "@/shared/components/ui/InputForm";
import { InputImage } from "@/shared/components/ui/InputImage";
import { UpdateCategory } from "@/types/widgets/category-management.types";
import { Box, Typography, useTheme } from "@mui/material"
import { useForm } from "react-hook-form";

export const CategoryManagementFormAddEdit = ({isUpdateCategory, setIsUpdateCategory} : UpdateCategory) => {
    const theme = useTheme();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const handleAddCategory = () => {
        reset();
        console.log('Thêm danh mục sản phẩm thành công');
        setIsUpdateCategory(null);
    }
    return (
        <Box>
            <Box sx={{
                backgroundColor: theme.palette.primary.light,
                py:2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold
            }}>
                <Typography variant='body2'>{isUpdateCategory ? 'Cập nhật danh mục' : 'Thêm mới danh mục sản'}</Typography>
            </Box>
                <form onSubmit={handleSubmit(handleAddCategory)}
                    style={{
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                    }}
                >
                    <InputForm
                        label='Tên danh mục'
                        important
                        placeholder='Thêm tên danh mục'
                        register={register}
                        errors={errors}
                        id='name'
                        validate = {{
                            required: 'Thông tin thiếu'
                        }}
                        sx={{
                            width: '750px'
                        }}
                    />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <InputForm
                                label='Mô tả'
                                important
                                placeholder='Nhập mô tả'
                                register={register}
                                errors={errors}
                                multiline
                                rows={9}
                                id='description'
                                validate = {{
                                    required: 'Thông tin thiếu'
                                }}
                                sx={{
                                    width: '450px'
                                }}
                            />
                            <Box
                                sx={{
                                    width: '300px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <InputImage/>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                pt: 3
                            }}
                        >
                            <Button name='Thêm Danh mục'/>
                        </Box>
                </form>
        </Box>
    )
}