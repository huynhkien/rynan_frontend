'use client'
import { addPriceProduct, getAllProduct } from "@/features/product/api/productApi";
import ProductInputPrice from "@/features/product/components/ProductInputPrice";
import { Product, ProductPrice } from "@/features/product/type/productType";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { PriceType } from "@/shared/constant/common";
import { Box, Typography, useTheme } from "@mui/material"
import {  useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const PriceManagementFormAdd = () => {
    const theme = useTheme();
    const { register, handleSubmit,  formState: { errors }, reset, control, watch} = useForm<ProductPrice>();
    const [product, setProduct] = useState<Product[] | []>([]);
    const productId = watch('productId') as string
    // Hiển thị thông tin sản phẩm
    const fetchAllProduct = async() => {
        const response = await getAllProduct();
        if(response.success) setProduct(response.data || []);
    }
    useEffect(() => {
        fetchAllProduct();
    },[]);
    
    // Thêm giá tiền
    const handleAddPriceProduct = async (data: ProductPrice) => {
        if (!productId) {
            toast.error('Vui lòng chọn sản phẩm');
            return;
        }
        try {
            const priceData = {
                priceType: data.priceType,
                price: data.price,
                startDate: data.startDate,
                endDate: data.endDate,
                note: data.note || ''
            };
           
            const response = await addPriceProduct({
                prices: priceData,
                id: productId
            });
            toast.success(response.message);
            
        } catch (error) {
            toast.error(`Lỗi: ${error}`);
            reset();
        }
    };
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
                    Thêm mới giá tiền sản phẩm
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(handleAddPriceProduct)}
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
                    <ControlledSelect
                        label='Chọn sản phẩm'
                        important
                        sx={{
                            width: '50%'
                        }}
                        name='productId'
                        control={control}
                        options={product}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                    <ControlledSelect
                        label='Chọn loại giá'
                        important
                        sx={{
                            width: '50%'
                        }}
                        name='priceType'
                        control={control}
                        options={PriceType}
                        rules={{
                        required: 'Vui lòng chọn loại giá',
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
                    <ProductInputPrice
                        label='Giá tiền'
                        type='number'
                        important
                        placeholder='Thêm giá tiền'
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='price'
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
                    <ProductInputPrice
                        label='Ngày bắt đầu'
                        type='date'
                        important
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='startDate'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ProductInputPrice
                        label='Ngày kết thúc'
                        type='date'
                        important
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='endDate'
                        sx={{
                            width: '50%'
                        }}
                    />
                </Box>
                <Box>
                    <ProductInputPrice
                        label='Ghi chú(nếu có)'
                        important
                        placeholder='Thêm ghi chú'
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='note'
                    />
                </Box>
                
                
                <Box sx={{ mt: 3 }}>
                    <Button 
                        name='Thêm giá tiền'
                    />
                </Box>
            </form>
        </Box>
    )
}