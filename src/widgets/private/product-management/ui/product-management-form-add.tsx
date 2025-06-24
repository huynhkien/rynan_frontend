'use client'


import { getAllCategory } from "@/features/category/api/categoryApi";
import { Category} from "@/features/category/type/categoryType";
import { createProduct } from "@/features/product/api/productApi";
import ProductFormInput from "@/features/product/components/ProductFormInput";
import { ProductInputImage } from "@/features/product/components/ProductInputImage";
import { ProductData } from "@/features/product/type/productType";
import { getAllSpecification } from "@/features/specification/api/specificationApi";
import { Specification } from "@/features/specification/type/specificationType";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { isActive, Origin } from "@/shared/constant/common";
import { Box, Paper, Tab, Tabs, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

const ProductManagementFormAddInfo = () => {
    const [category, setCategory] = useState<Category[] | []>([]);
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const { register, handleSubmit,  formState: { errors }, reset, control} = useForm<ProductData>();
    // Hiển thị danh mục
    const fetchCategory = async () => {
        const response = await getAllCategory();
        if(response.success) setCategory(response.data || [])
    }
    // Hiển thị quy cách
    const fetchSpecification = async () => {
        const response = await getAllSpecification();
        if(response.success) setSpecification(response.data || [])
    }
    useEffect(() => {
        fetchCategory();
        fetchSpecification();
    },[]);
    // Thêm sản phẩm
    const handleAddProduct = async (data: ProductData) => {
        try {
            const formData = new FormData();
            formData.append("name_vn", data.name_vn); 
            formData.append("name_eng", data.name_eng); 
            formData.append("name_short", data.name_short); 
            formData.append("category", data.category); 
            formData.append("code", data.code);  
            formData.append("origin", data.origin);  
            formData.append("isActive", data.isActive);  
            formData.append("tags", data.tags);  
            formData.append("price_reference", data.price_reference?.toString() || "0");  
            if (data.thumb && data.thumb.length > 0) {
                formData.append("thumb", data.thumb[0]); 
            }
            const response = await createProduct(formData);
            if (response.success === false) {
                toast.error(response.message);
                reset();
                return;
            }
            toast.success(response.message);
            reset();
        } catch (error: unknown) {
            toast.error(`Lỗi: ${error}`);
            reset();
        }
    };
    return (
         <form onSubmit={handleSubmit(handleAddProduct)}
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
                    <ProductFormInput
                        label='Mã sản phẩm'
                        important
                        placeholder='Thêm mã sản phẩm'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='code'
                        validate={{
                            required: 'Tên mã sản phẩm không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ProductFormInput
                        label='Tên sản phẩm tiếng việt'
                        important
                        placeholder='Thêm tên sản phẩm'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='name_vn'
                        validate={{
                            required: 'Tên tên sản phẩm không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
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
                    <ProductFormInput
                        label='Tên sản phẩm tiếng anh'
                        important
                        placeholder='Thêm tên sản phẩm tiếng anh'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='name_eng'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ProductFormInput
                        label='Tên ngắn rút gọn'
                        important
                        placeholder='Thêm tên ngắn rút gọn'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='name_short'
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
                    <ProductFormInput
                        label='Giá tham khảo'
                        important
                        type='number'
                        placeholder='Thêm giá tham khảo'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='price_reference'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ControlledSelect
                        label='Danh mục'
                        important
                        sx={{
                            width: '50%'
                        }}
                        name='category'
                        control={control}
                        options={category}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
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
                    <ControlledSelect
                        label='Quy cách'
                        important
                        sx={{
                            width: '33%'
                        }}
                        name='specification'
                        control={control}
                        options={specification}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                    <ControlledSelect
                        label='Nhà sản xuất'
                        important
                        sx={{
                            width: '33%'
                        }}
                        name='origin'
                        control={control}
                        options={Origin}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                    <ControlledSelect
                        label='Trạng thái'
                        important
                        sx={{
                            width: '33%'
                        }}
                        name='isActive'
                        control={control}
                        options={isActive}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <ProductFormInput
                        label='Tags'
                        important
                        placeholder='Thêm tags'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='tags'
                        sx={{
                            width: '60%'
                        }}
                        
                    />
                    <Box sx={{
                    width: '40%',
                }}>
                    <ProductInputImage
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
                
            
                
                <Box sx={{ mt: 3 }}>
                    <Button 
                        name='Thêm sản phẩm'
                    />
                </Box>
            </form>
    )
}
export const ProductManagementFormAdd = () => {
    const theme = useTheme();
    
    const [tabIndex, setTabIndex] = useState<number>(0); 
        const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
            if (newValue >= 0 && newValue <= 1) {
                setTabIndex(newValue);
            } else {
                setTabIndex(0);
            }
        };
    
        const getInfoTab = () => {
            switch(tabIndex) {
                case 0:
                    return <ProductManagementFormAddInfo/>;
                case 1: 
                    return <ProductManagementFormAddInfo/>;
                default:
                    return <ProductManagementFormAddInfo/>;
            }
        }

    
    return (
        <Paper
            sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.default }}
        >
            <Box
            sx={{
                py: 2
            }}>
          <Box>
            <Typography variant='h6' sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
            Quản lý sản phẩm
          </Typography>
          </Box>
          <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.background.default} `, 
          }}
          >
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                sx={{
                    width: { xs: '100%', md: '30%' },
                    display: 'flex',
                    borderRadius: '5px',
                    py: 2,
                    
                    
                }}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab 
                    label='Thông tin sản phẩm' 
                    sx={{
                        fontSize: theme.typography.body1.fontSize,
                        color: theme.palette.text.primary,
                        '&.Mui-selected': {
                            color: theme.palette.text.secondary,
                            backgroundColor: theme.palette.primary.light,
                        }
                    }} 
                />
                <Tab 
                    label='Bài Viết' 
                    sx={{
                        fontSize: theme.typography.body1.fontSize,
                        color: theme.palette.text.primary,
                        '&.Mui-selected': {
                            color: theme.palette.text.secondary,
                            backgroundColor: theme.palette.primary.light,
                        }
                    }} 
                />
            </Tabs>
          </Box>
        </Box>
        <Box>
            {getInfoTab()}
        </Box>
        </Paper>
    )
}