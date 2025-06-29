'use client'
import {  getProductById } from "@/features/product/api/productApi";
import QuoteFormInput from "@/features/quote/component/QuoteFormInput";
import { QuoteProductData } from "@/features/quote/type/quoteType";
import { Button } from "@/shared/components";
import { Box, Typography, useTheme } from "@mui/material"
import {  useEffect } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";

export const QuoteManagementFormProductEdit = ({id}: {id: string}) => {
    const theme = useTheme();
    const { register,  formState: { errors }, reset} = useForm<QuoteProductData>();
    // Hiển thị thông tin sản phẩm
    useEffect(() => {
        const fetchProduct = async() => {
            const response = await getProductById(id);
            if(response.success) {
                reset({
                    code: response.data.code,
                    name_vn: response.data.name_vn,
                    
                })
            };
        }
        fetchProduct();
    },[id, reset]);
    
    // // Thêm giá tiền
    // const handleAddPriceProduct = async (data: QuoteProductData) => {
    //     if (!productId) {
    //         toast.error('Vui lòng chọn sản phẩm');
    //         return;
    //     }
    //     try {
    //         const priceData = {
    //             priceType: data.priceType,
    //             price: data.price,
    //             startDate: data.startDate,
    //             endDate: data.endDate,
    //             note: data.note || ''
    //         };
           
    //         const response = await addPriceProduct({
    //             prices: priceData,
    //             id: productId
    //         });
    //         toast.success(response.message);
    //         reset();
            
    //     } catch (error) {
    //         const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
    //         toast.error(errorMessage)
    //         reset();
    //     }
    // };
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
            
            <form
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
                    <QuoteFormInput
                        label='Giá tiền'
                        type='number'
                        important
                        placeholder='Thêm giá tiền'
                        register={register as UseFormRegister<QuoteProductData>}
                        errors={errors as FieldErrors<QuoteProductData>}
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
                    <QuoteFormInput
                        label='Ngày bắt đầu'
                        type='date'
                        important
                        register={register as UseFormRegister<QuoteProductData>}
                        errors={errors as FieldErrors<QuoteProductData>}
                        id='startDate'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <QuoteFormInput
                        label='Ngày kết thúc'
                        type='date'
                        important
                        register={register as UseFormRegister<QuoteProductData>}
                        errors={errors as FieldErrors<QuoteProductData>}
                        id='endDate'
                        sx={{
                            width: '50%'
                        }}
                    />
                </Box>
                <Box>
                    <QuoteFormInput
                        label='Ghi chú(nếu có)'
                        important
                        placeholder='Thêm ghi chú'
                        register={register as UseFormRegister<QuoteProductData>}
                        errors={errors as FieldErrors<QuoteProductData>}
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