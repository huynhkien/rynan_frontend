'use client'
import ReceiptProductFormInput from "@/features/receipt/components/ReceiptProductFormInput";
import {  ReceiptImportManagementFormAddEditProductItemProps, ReceiptProductData } from "@/features/receipt/type/receiptType";
import { addProductToReceipt, updateProductByPid } from "@/features/user/store/userSlice";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect"
import { useAppDispatch } from "@/shared/hooks/useAppHook";
import { Box, Button as ButtonItem, Typography, useTheme } from "@mui/material"
import { useEffect } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const ReceiptImportManagementFormAddEditProductItem = ({isEditProductState, products, productReceipt, handleSelectProduct, product, specifications}: ReceiptImportManagementFormAddEditProductItemProps) => {
    const { register, formState: { errors }, reset, control, setValue, watch} = useForm<ReceiptProductData>();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const selectedQuantity = watch('quantity'); 
    const isNumberQuantity = selectedQuantity ? parseInt(selectedQuantity.toString(), 10) : 0;
    const selectedBatchNumber = watch('batchNumber');  
    const selectedExpiryDate = watch('expiryDate');  
    const selectedManufacturingDate = watch('manufacturingDate');
    //  reset
    const resetValue = () => {
        setValue('name', '');
        setValue('quantity', 0);
        setValue('batchNumber', '');
        setValue('expiryDate', '');
        setValue('manufacturingDate', ''); 
        setValue('batchNumber', ''); 
    } 
    // Hiển thị giá trị quy cách
    useEffect(() => {
        if(!specifications) return;
        if (product?.specification && specifications?.length > 0) {
            const specificationName = specifications?.find(el => el._id === product?.specification)?.name;
            setValue('specification', specificationName || '');
        } else {
            setValue('specification', ''); 
        }
    }, [product, specifications, setValue]);
    // Thêm product redux
    const handleAddProduct = async () => {
        if(!product?._id ||!product.specification || !product?.name_vn || !selectedQuantity  || !selectedBatchNumber || !selectedExpiryDate || !selectedManufacturingDate  ){
            toast.error('Thiếu thông tin về sản phẩm');
            return;
        }
        if(productReceipt && productReceipt?.find(el => el.pid === product._id)){
            toast.error('Vui lòng chọn loại sản phẩm khác');
            return;
        }
        dispatch(addProductToReceipt({
            pid: product._id,
            name: product.name_vn,
            specification: product.specification,
            quantity: isNumberQuantity,
            batchNumber: selectedBatchNumber,
            expiryDate: selectedExpiryDate,
            manufacturingDate: selectedManufacturingDate
        }));
        toast.success('Thêm sản phẩm thành công');
        resetValue()
    }
    // Cập nhật thông tin sản phẩm theo trạng thái
        useEffect(() => {
            if(isEditProductState && productReceipt && specifications) {
                const filteredProduct = productReceipt?.find(el => el.pid === isEditProductState);
                console.log(filteredProduct);
                reset({
                    name: filteredProduct?.name,
                    specification: specifications.find(el => el._id === filteredProduct?.specification)?.name,
                    quantity: filteredProduct?.quantity,
                    batchNumber: filteredProduct?.batchNumber,
                    expiryDate: filteredProduct?.expiryDate,
                    manufacturingDate: filteredProduct?.manufacturingDate,
                })
            }
        },[isEditProductState, productReceipt, reset, specifications])
        const handleUpdateProduct = async() => {
            if(!isEditProductState) return;
            const filteredProduct = productReceipt?.find(el => el.pid === isEditProductState);
            dispatch(updateProductByPid({
                pid: isEditProductState,
                name: filteredProduct?.name,
                specification: filteredProduct?.specification,
                quantity: selectedQuantity,
                batchNumber: selectedBatchNumber,
                expiryDate: selectedExpiryDate,
                manufacturingDate: selectedManufacturingDate
            }));
            toast.success('Cập nhật nguyên liệu thành công');
        }
    return (
        <>
        {isEditProductState &&
            <Typography variant='body2' sx={{color: theme.palette.text.secondary, backgroundColor: theme.palette.primary.main, p:2}}>Cập nhật thông tin sản phẩm</Typography>
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            {/* sản phẩm */}
            {isEditProductState ?
                <ReceiptProductFormInput
                    label='Tên sản phẩm'
                    placeholder='Tên sản phẩm'
                    disabled
                    id='name'
                    register={register as UseFormRegister<ReceiptProductData>}
                    errors={errors as FieldErrors<ReceiptProductData>}
                />
            :
                <ControlledSelect
                    label='sản phẩm cần nhập'
                    placeholder='Lựa chọn mguyên liệu cần nhập'
                    name='pid'
                    onSelectionChange={handleSelectProduct}
                    control={control}
                    options={products?.map(el => ({
                        _id: el?._id as string,
                        name: el?.name_vn
                    })) || []}
                    rules={{ required: 'Vui lòng chọn sản phẩm cần nhập' }}
                />
            }
            <ReceiptProductFormInput
                label='Đơn vị tính'
                placeholder='Đơn vị tính'
                disabled
                id='specification'
                register={register as UseFormRegister<ReceiptProductData>}
                errors={errors as FieldErrors<ReceiptProductData>}
            />
            <ReceiptProductFormInput
                label='Số lượng sản phẩm'
                placeholder='Số lượng sản phẩm'
                type='number'
                id='quantity'
                register={register as UseFormRegister<ReceiptProductData>}
                errors={errors as FieldErrors<ReceiptProductData>}
                validate={{ required: 'Số lượng ko không được để trống' }}
            />
            <ReceiptProductFormInput
                label='Số lô hàng'
                placeholder='Số lô hàng'
                id='batchNumber'
                register={register as UseFormRegister<ReceiptProductData>}
                errors={errors as FieldErrors<ReceiptProductData>}
                validate={{ required: 'Số lô hàng ko không được để trống' }}
            />
            <ReceiptProductFormInput
                label='Ngày sản xuất của sản phẩm nhập'
                type='date'
                placeholder='Ngày sản xuất của sản phẩm nhập'
                id='manufacturingDate'
                register={register as UseFormRegister<ReceiptProductData>}
                errors={errors as FieldErrors<ReceiptProductData>}
                validate={{ required: 'Ngày sản xuất ko không được để trống' }}
            />
            <ReceiptProductFormInput
                label='Hạn sử dụng của sản phẩm nhập'
                type='date'
                placeholder='Hạn sử dụng của sản phẩm nhập'
                id='expiryDate'
                register={register as UseFormRegister<ReceiptProductData>}
                errors={errors as FieldErrors<ReceiptProductData>}
                validate={{ required: 'Hạn sử dụng ko không được để trống' }}
            />
            <ButtonItem onClick={isEditProductState? handleUpdateProduct : handleAddProduct} sx={{py:2, color: theme.palette.text.secondary, backgroundColor: theme.palette.primary.main}}>
                {isEditProductState ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </ButtonItem>
        </Box>
        </>
    )
}