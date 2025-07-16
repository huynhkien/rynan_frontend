'use client'
import {getOrderById, updateProductOrder } from "@/features/order/api/orderApi"
import {  OrderManagementFormAddProductProps } from "@/features/order/type/orderType"
import { getProductById } from "@/features/product/api/productApi"
import ProductFormInput from "@/features/product/components/ProductFormInput"
import { Product, ProductData } from "@/features/product/type/productType"
import { addProductToOrder } from "@/features/user/store/userSlice"
import { OrderProductItem } from "@/features/user/type/userTypes"
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect"
import { PriceType } from "@/shared/constant/common"
import { useAppDispatch, useAppSelector} from "@/shared/hooks/useAppHook"
import { showModal } from "@/shared/store/appSlice"
import { Box,  Button,  Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form"
import { toast } from "react-toastify"

export const OrderManagementFormAddEditProduct = ({
    handleSelectionChangeProduct, 
    products, 
    product, 
    orderProducts, 
    edit, 
    oid, 
    pid, 
    order, 
    render,
} : OrderManagementFormAddProductProps) => {
    const { register, formState: { errors }, control, setValue, watch, } = useForm<ProductData>();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {orderProduct} = useAppSelector((state) => state.user);
    const [priceProduct, setPriceProduct] = useState<number>();
    const [productUpdate, setProductUpdate] = useState<Product>();
    const [priceType, setPriceType] = useState<string>();
    const selectedQuantity = watch('quantity');
    const quantityAsNumber = selectedQuantity ? parseInt(selectedQuantity.toString(), 10) : 0;

    
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
        const existingProduct = orderProducts?.find((el) => el.pid === product._id && el.priceType !== priceType)
        if(existingProduct){
            toast.error('Sản phẩm chỉ chứa một loại giá duy nhất. Vui lòng chọn lại loại giá để tạo đơn đặt hàng');
            return;
        }
        const existingProductOrder = order?.products.find((el) => el.pid === product._id && el.priceType !== priceType);
        if(order && existingProductOrder) {
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
        toast.success('Thêm sản phẩm thành công')
    }
    
    // Xử lý cập nhật sản phẩm
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
                setPriceType(filteredProduct?.priceType);
                setPriceProduct(filteredProduct?.price);
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
            if(orderProduct && orderProduct.find((el) => el.priceType !== priceType)){
                toast.error('Loại giá cập nhập với loại giá vừa thêm không trùng khớp. Vui lòng lựa chọn lại!!!');
                return;
            }
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            const response = await updateProductOrder(newDataUpdate as OrderProductItem, oid as string , pid as string);
            if(response.success) {
                dispatch(showModal({ isShowModal: false, modalType: null }));
                toast.success(response.message);
                if (render) {
                    render();
                }
            }
        }catch(error: unknown){
            dispatch(showModal({ isShowModal: false, modalType: null }));
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
                <Button sx={{backgroundColor: theme.palette.primary.main, py:2, color: theme.palette.text.secondary}} onClick={pid ? handleUpdateProduct : handleAddProduct}>
                    {pid ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                </Button>
            </Box>
       </Box>
    )
}