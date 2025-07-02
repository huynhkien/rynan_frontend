'use client'
import { getAllOrder, getOrderById, updateProductOrder } from "@/features/order/api/orderApi"
import { OrderManagementFormAddProductProps } from "@/features/order/type/orderType"
import { getProductById } from "@/features/product/api/productApi"
import ProductFormInput from "@/features/product/components/ProductFormInput"
import { Product, ProductData } from "@/features/product/type/productType"
import { addProductToOrder } from "@/features/user/store/userSlice"
import { OrderProductItem } from "@/features/user/type/userTypes"
import { Button } from "@/shared/components"
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect"
import { PriceType } from "@/shared/constant/common"
import { useAppDispatch } from "@/shared/hooks/useAppHook"
import { Box,  Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form"
import { toast } from "react-toastify"

export const OrderManagementFormAddEditProduct = ({handleSelectionChangeProduct, products, product, orderProduct, edit, oid, pid} : OrderManagementFormAddProductProps) => {
    const { register, formState: { errors }, control, setValue, watch, reset, } = useForm<ProductData>();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [priceProduct, setPriceProduct] = useState<number>();
    const [productUpdate, setProductUpdate] = useState<Product>();
    const [priceType, setPriceType] = useState<string>();
    const selectedQuantity = watch('quantity');
    const quantityAsNumber = selectedQuantity ? parseInt(selectedQuantity.toString(), 10) : 0;
    console.log(selectedQuantity);
    // Xử lý lựa chọn giá khi thêm sản phẩm
    const handleSelectionChangePrice = (id: string | number ) => {
         const filteredPrice = product?.prices.find((el) => el.priceType === id)?.price;
         if (filteredPrice !== undefined) {
             setValue('price', filteredPrice.toLocaleString());
             setPriceType(id as string);
             setPriceProduct(filteredPrice);
         } else {
             setValue('price', 'Giá chưa cập nhật');
         }
    };
    // Khi cập nhật sản phẩm
    const handleSelectionChangePriceUpdate = (id: string | number ) => {
         const filteredPrice = productUpdate?.prices.find((el) => el.priceType === id)?.price;
         if (filteredPrice !== undefined) {
             setValue('price', filteredPrice.toLocaleString());
             setPriceType(id as string);
             setPriceProduct(filteredPrice);
         } else {
             setValue('price', 'Giá chưa cập nhật');
         }
    };
    // Xử lý thêm sản phẩm
    const handleAddProduct = () => {
        if (!product?._id || !product.name_vn || !product.thumb?.url || !priceProduct || !selectedQuantity) {
            toast.error('Thiếu thông tin sản phẩm!');
            return;
        }
        const existingProduct = orderProduct?.find((el) => el.pid === product._id && el.priceType !== priceType)
        if(existingProduct){
            toast.error('Sản phẩm chỉ chứa một loại giá duy nhất. Vui lòng chọn lại loại giá để tạo đơn đặt hàng');
            return;
        }
        dispatch(addProductToOrder({
            pid: product._id,
            name: product.name_vn,
            price: priceProduct,
            thumb: product.thumb.url,
            quantity: quantityAsNumber,
            priceType: priceType
        }));
        reset();
        toast.success('Thêm sản phẩm thành công')
    }
    // Xử lý cập nhật sản phẩm
    const fetchAllOrder = async () => {
        return await getAllOrder();
    }
    useEffect(() => {
        fetchAllOrder();
    }, [])
    useEffect(() => {
        if(!pid) return;
        const fetchProduct = async () => {
            const response = await getProductById(pid);
            if(response.success) setProductUpdate(response.data)
        }
        fetchProduct();
    },[pid])
    useEffect(() => {
        if(!pid || !oid) return;
        const fetchProductQuote = async() => {
            const response = await getOrderById(oid as string);
            console.log(response.data);
            const filteredProduct = response.data?.products.find((el) => el.pid === pid)
            if(response.success && response.data){
                setValue('pid', filteredProduct?.pid);
                setValue('quantity', filteredProduct?.quantity);
                setValue('price', filteredProduct?.price);
                setValue('priceType', filteredProduct?.priceType);
            }
            
        }
        fetchProductQuote();

    },[pid, oid, setValue]);
    const handleUpdateProduct = async () => {
        try {
            const newDataUpdate = {
            pid: pid,
            name: productUpdate?.name_vn,
            priceType: priceType,
            price: priceProduct,
            quantity: quantityAsNumber,
            }
            const response = await updateProductOrder(newDataUpdate as OrderProductItem, oid as string , pid as string);
            if(response.success) {
                toast.success(response.message);
                fetchAllOrder();
            }
            }catch(error: unknown){
                const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
                toast.error(errorMessage)
            }
    }
    
   
    

    return (
       <Box>
            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: `${edit ? theme.palette.primary.main : ''}`  }}>
                <Typography variant='body2' sx={{ color: `${edit ? theme.palette.text.secondary : theme.palette.primary.main}`, mx: 2, fontWeight: 'bold' }}>
                    {edit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                {/* Chọn sản phẩm */}
                {oid && pid ?
                <ControlledSelect
                    label='Chọn sản phẩm'
                    onSelectionChange={handleSelectionChangeProduct}
                    important
                    disabled
                    sx={{ width: '100%' }}
                    name='pid'
                    control={control}
                    options={products?.map((el) => ({
                        _id: el._id,
                        name: el.name_vn
                    })) || []}
                    searchable
                    rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                />
                :
                <ControlledSelect
                    label='Chọn sản phẩm'
                    onSelectionChange={handleSelectionChangeProduct}
                    important
                    sx={{ width: '100%' }}
                    name='pid'
                    control={control}
                    options={products?.map((el) => ({
                        _id: el._id,
                        name: el.name_vn
                    })) || []}
                    searchable
                    rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                />    
                
                }
                <ProductFormInput
                    label='Số lượng'
                    important
                    type='number'
                    placeholder='Số lượng'
                    register={register as UseFormRegister<ProductData>}
                    errors={errors as FieldErrors<ProductData>}
                    id='quantity'
                    sx={{
                        width: '100%'
                    }}
                />
                <ControlledSelect
                    label='Lựa chọn giá'
                    important
                    sx={{ width: '100%' }}
                    name='priceType'
                    onSelectionChange={pid ? handleSelectionChangePriceUpdate : handleSelectionChangePrice}
                    control={control}
                    options={pid ? 
                    productUpdate?.prices?.map((el) => ({
                        _id: el.priceType,
                        name: PriceType.find((p) => p._id === el.priceType)?.name as string
                    })) || []
                    :
                    product?.prices?.map((el) => ({
                        _id: el.priceType,
                        name: PriceType.find((p) => p._id === el.priceType)?.name as string
                    })) || []}
                    rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                />
                <ProductFormInput
                    label='Giá'
                    placeholder='Giá'
                    register={register as UseFormRegister<ProductData>}
                    errors={errors as FieldErrors<ProductData>}
                    id='price'
                    sx={{
                        width: '100%'
                    }}
                />
                <Button handleOnClick={pid ? handleUpdateProduct : handleAddProduct} name={edit ? 'Cập nhật' : 'Thêm sản phẩm'} />
            </Box>
       </Box>
    )
}