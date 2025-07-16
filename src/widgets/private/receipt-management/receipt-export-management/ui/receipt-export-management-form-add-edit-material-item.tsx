'use client'
import { updateMaterialReceipt } from "@/features/receipt/api/receiptApi";
import ReceiptMaterialFormInput from "@/features/receipt/components/ReceiptMaterialFormInput";
import { ReceiptImportManagementFormAddEditMaterialItemProps, ReceiptMaterialData } from "@/features/receipt/type/receiptType";
import { addMaterialToReceipt, updateMaterialByMid } from "@/features/user/store/userSlice";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect"
import { useAppDispatch } from "@/shared/hooks/useAppHook";
import { showModal } from "@/shared/store/appSlice";
import { Box, Button as ButtonItem, Typography, useTheme } from "@mui/material"
import { useEffect } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const ReceiptExportManagementFormAddEditMaterialItem = ({render, receipt, isEditMaterialState, specifications, materialReceipt, materials, material, handleSelectMaterial, materialId}: ReceiptImportManagementFormAddEditMaterialItemProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { register, formState: { errors }, control, watch, reset, setValue} = useForm<ReceiptMaterialData>();
    const selectedPrice = watch('price');  
    const isNumberPrice = selectedPrice ? parseInt(selectedPrice.toString(), 10) : 0;
    const selectedQuantity = watch('quantity'); 
    const isNumberQuantity = selectedQuantity ? parseInt(selectedQuantity.toString(), 10) : 0;
    const selectedBatchNumber = watch('batchNumber');  
    const selectedExpiryDate = watch('expiryDate');  
    const selectedManufacturingDate = watch('manufacturingDate');
    //  reset
    const resetValue = () => {
        setValue('price', 0);
        setValue('name', '');
        setValue('quantity', 0);
        setValue('batchNumber', '');
        setValue('expiryDate', '');
        setValue('manufacturingDate', ''); 
        setValue('batchNumber', ''); 
    } 
    // Thêm material redux
    const handleAddMaterial = async () => {
        if(!material?._id ||!material.specification || !material?.name || !selectedQuantity || !selectedPrice || !selectedBatchNumber || !selectedExpiryDate || !selectedManufacturingDate  ){
            toast.error('Thiếu thông tin về nguyên liệu');
            return;
            
        }
        if(materialReceipt && materialReceipt?.find(el => el.mid === material._id)){
            toast.error('Vui lòng chọn loại nguyên liệu khác');
            return;
        }
        
        const existedMaterial = receipt?.materials?.find(el => el.mid === material._id);
        if (existedMaterial) {
            const isMismatch = 
                existedMaterial.batchNumber !== selectedBatchNumber ||
                (existedMaterial.expiryDate as string).split('T')[0] !== selectedExpiryDate ||
                (existedMaterial.manufacturingDate as string).split('T')[0] !== selectedManufacturingDate ||
                existedMaterial.price !== isNumberPrice;
            if (isMismatch) {
                toast.error('Vui lòng nhập đúng thông tin đã tồn tại cho nguyên liệu này');
                return;
            }
        }
        dispatch(addMaterialToReceipt({
            mid: material._id,
            name: material.name,
            specification: material.specification,
            quantity: isNumberQuantity,
            price: isNumberPrice,
            batchNumber: selectedBatchNumber,
            expiryDate: selectedExpiryDate,
            manufacturingDate: selectedManufacturingDate
        }));
        toast.success('Thêm nguyên liệu thành công');
        resetValue();
    }
    // Hiển thị giá trị quy cách
    useEffect(() => {
        if(!specifications) return;
        if (material?.specification && specifications?.length > 0) {
            const specificationName = specifications?.find(el => el._id === material?.specification)?.name;
            setValue('specification', specificationName || '');
        } else {
            setValue('specification', ''); 
        }
    }, [material, specifications, setValue]);
    // Cập nhật thông tin nguyên liệu theo trạng thái
    useEffect(() => {
        if(isEditMaterialState && materialReceipt && specifications) {
            const filteredMaterial = materialReceipt?.find(el => el.mid === isEditMaterialState);
            reset({
                name: filteredMaterial?.name,
                specification: specifications.find(el => el._id === filteredMaterial?.specification)?.name,
                price: filteredMaterial?.price,
                quantity: filteredMaterial?.quantity,
                batchNumber: filteredMaterial?.batchNumber,
                expiryDate: (filteredMaterial?.expiryDate as string)?.split('T')[0],
                manufacturingDate: (filteredMaterial?.manufacturingDate as string)?.split('T')[0],
            })
        }
    },[isEditMaterialState, materialReceipt, reset, specifications])
    const handleUpdateMaterial = async() => {
        if(!isEditMaterialState) return;
        const filteredMaterial = materialReceipt?.find(el => el.mid === isEditMaterialState);
        dispatch(updateMaterialByMid({
            mid: isEditMaterialState,
            name: filteredMaterial?.name,
            specification: filteredMaterial?.specification,
            quantity: selectedQuantity,
            price: selectedPrice,
            batchNumber: selectedBatchNumber,
            expiryDate: selectedExpiryDate,
            manufacturingDate: selectedManufacturingDate
        }));
        toast.success('Cập nhật nguyên liệu thành công');
    }
    // Cập nhật thông tin trong dữ liệu
    const handleUpdateMaterialById = async () => {
        try {
            if(!materialId) {
            toast.error('Không tìm thấy thấy thông id của phiếu');
            return;
            }
            const filteredMaterial = materialReceipt?.find(el => el.mid === isEditMaterialState);
            const newData = {
                name: filteredMaterial?.name,
                specification: filteredMaterial?.specification,
                quantity: selectedQuantity,
                price: selectedPrice,
                batchNumber: selectedBatchNumber,
                expiryDate: selectedExpiryDate,
                manufacturingDate: selectedManufacturingDate
            }
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            const response = await updateMaterialReceipt(newData, materialId, isEditMaterialState as string);
            if(response.success){
                dispatch(showModal({ isShowModal: false, modalType: null }));
                toast.success(response.message);
                if(render){
                    render();
                }
            }
        } catch(error: unknown){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        } 
    }
    return (
        <>
        {isEditMaterialState &&
            <Typography variant='body2' sx={{color: theme.palette.text.secondary, backgroundColor: theme.palette.primary.main, p:2}}>Cập nhật thông tin nguyên liệu</Typography>
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            
            {/* Nguyên liệu */}
            {
                isEditMaterialState ? 
                (
                    <ReceiptMaterialFormInput
                        label='Tên sản phẩm'
                        placeholder='Tên sản phẩm'
                        disabled
                        id='name'
                        register={register as UseFormRegister<ReceiptMaterialData>}
                        errors={errors as FieldErrors<ReceiptMaterialData>}
                    />   
                )
                :
                (
                    <ControlledSelect
                    label='Nguyên liệu cần nhập'
                    placeholder='Lựa chọn mguyên liệu cần nhập'
                    name='mid'
                    onSelectionChange={handleSelectMaterial}
                    control={control}
                    options={materials?.map(el => ({
                        _id: el?._id as string,
                        name: el?.name
                    })) || []}
                    rules={{ required: 'Vui lòng chọn nguyên liệu cần nhập' }}
                />
                )
            }
            <ReceiptMaterialFormInput
                label='Đơn vị tính'
                placeholder='Đơn vị tính'
                disabled
                id='specification'
                register={register as UseFormRegister<ReceiptMaterialData>}
                errors={errors as FieldErrors<ReceiptMaterialData>}
            />
            <ReceiptMaterialFormInput
                label='Giá nguyên liệu'
                placeholder='Giá nguyên liệu'
                type='number'
                id='price'
                register={register as UseFormRegister<ReceiptMaterialData>}
                errors={errors as FieldErrors<ReceiptMaterialData>}
                validate={{ required: 'Giá ko không được để trống' }}
            />
            <ReceiptMaterialFormInput
                label='Số lượng nguyên liệu'
                placeholder='Số lượng nguyên liệu'
                type='number'
                id='quantity'
                register={register as UseFormRegister<ReceiptMaterialData>}
                errors={errors as FieldErrors<ReceiptMaterialData>}
                validate={{ required: 'Số lượng ko không được để trống' }}
            />
            <ReceiptMaterialFormInput
                label='Số lô hàng'
                placeholder='Số lô hàng'
                id='batchNumber'
                register={register as UseFormRegister<ReceiptMaterialData>}
                errors={errors as FieldErrors<ReceiptMaterialData>}
                validate={{ required: 'Số lô hàng ko không được để trống' }}
            />
            <ReceiptMaterialFormInput
                label='Ngày sản xuất của nguyên liệu nhập'
                type='date'
                placeholder='Ngày sản xuất của nguyên liệu nhập'
                id='manufacturingDate'
                register={register as UseFormRegister<ReceiptMaterialData>}
                errors={errors as FieldErrors<ReceiptMaterialData>}
                validate={{ required: 'Ngày sản xuất ko không được để trống' }}
            />
            <ReceiptMaterialFormInput
                label='Hạn sử dụng của nguyên liệu nhập'
                type='date'
                placeholder='Hạn sử dụng của nguyên liệu nhập'
                id='expiryDate'
                register={register as UseFormRegister<ReceiptMaterialData>}
                errors={errors as FieldErrors<ReceiptMaterialData>}
                validate={{ required: 'Hạn sử dụng ko không được để trống' }}
            />
            {materialId ?
            <ButtonItem onClick={handleUpdateMaterialById} sx={{py:2, color: theme.palette.text.secondary, backgroundColor: theme.palette.primary.main}}>
                Cập nhật nguyên liệu
            </ButtonItem>
            :
            <ButtonItem onClick={isEditMaterialState? handleUpdateMaterial : handleAddMaterial} sx={{py:2, color: theme.palette.text.secondary, backgroundColor: theme.palette.primary.main}}>
                {isEditMaterialState ? 'Cập nhật nguyên liệu' : 'Thêm nguyên liệu'}
            </ButtonItem>    
            }
        </Box>
        </>
    )
}