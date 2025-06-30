'use client'
import {  addUpdatePriceProduct, getProductById } from "@/features/product/api/productApi";
import ProductInputPrice from "@/features/product/components/ProductInputPrice";
import { ProductPrice } from "@/features/product/type/productType";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { PriceType } from "@/shared/constant/common";
import { Box, Typography, useTheme } from "@mui/material"
import {  useEffect } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const QuoteManagementFormProductEdit = ({productId, ren}: {productId: string | null; ren: () => void}) => {
    const theme = useTheme();
    console.log(productId);
    const { register,  formState: { errors }, reset, control, handleSubmit, watch, setValue} = useForm<ProductPrice>();
    
    // Theo dõi thay đổi của priceType
    const selectedPriceType = watch('priceType');
    
    // Hiển thị thông tin sản phẩm
    useEffect(() => {
        const fetchProduct = async() => {
            if(!productId) return;
            const response = await getProductById(productId);
            console.log(response);
            if(response.success) {
                reset({
                    code: response.data.code,
                    name_vn: response.data.name_vn,
                })
            };
        }
        fetchProduct();
    },[productId, reset]);
    
    // Cập nhật giá tiền khi chọn priceType
    useEffect(() => {
        const updatePriceByType = async () => {
            if (!productId || !selectedPriceType) return;
            
            const response = await getProductById(productId);
            if (response.success && response.data.prices) {
                const existingPrice = response.data.prices.find(p => p.priceType === selectedPriceType);
                
                if (existingPrice) {
                    // Nếu có giá cho loại này, hiển thị thông tin
                    setValue('price', existingPrice.price);
                    setValue('startDate', (existingPrice.startDate as string)?.split('T')[0]);
                    setValue('endDate', (existingPrice.endDate as string)?.split('T')[0]);
                    setValue('note', existingPrice.note || '');
                } else {
                    // Nếu không có giá cho loại này, clear các field
                    setValue('price', 0);
                    setValue('startDate', '');
                    setValue('endDate', '');
                    setValue('note', '');
                }
            }
        };
        
        updatePriceByType();
    }, [selectedPriceType, productId, setValue]);
    
    // Cập nhật giá tiền sản phẩm
    const handleAddPriceProduct = async (data: ProductPrice) => {
        if (!productId) {
            toast.error('Vui lòng chọn sản phẩm');
            return;
        }
        try {
            const priceData = {
                priceType: data.priceType,
                price: Number(data.price),
                startDate: data.startDate,
                endDate: data.endDate,
                note: data.note || ''
            };
           
            const response = await addUpdatePriceProduct({
                updatePrice: priceData,
                id: productId
            });
            toast.success(response.message);
            reset();
            ren();
            
        } catch (error) {
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage);
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
                    Cập nhật giá tiền sản phẩm
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
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <ProductInputPrice
                        label='Mã sản phẩm'
                        important
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='code'
                        disabled
                        sx={{
                            width: '100%',
                        }}
                    />
                    <ProductInputPrice
                        label='Tên sản phẩm'
                        important
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='name_vn'
                        disabled
                        sx={{
                            width: '100%',
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
                        }}
                    />
                    <ProductInputPrice
                        label='Đặt giá tiền'
                        important
                        type='number'
                        placeholder='Vui lòng nhập giá tiền'
                        register={register as UseFormRegister<ProductPrice>}
                        errors={errors as FieldErrors<ProductPrice>}
                        id='price'
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