'use client'
import InventoryFormInput from "@/features/inventory/component/InventoryFormInput";
import { InventoryData, InventoryMaterialData, InventoryProductData} from "@/features/inventory/type/inventoryType";
import { ReceiptApprovePendingManagementFormAddEditProps, ReceiptData, ReceiptMaterialData, ReceiptProductData } from "@/features/receipt/type/receiptType";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { ReceiptStatus, shelfLocation } from "@/shared/constant/common";
import { Box, Typography, useTheme } from "@mui/material"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { ReceiptImportManagementFormListMaterialItem } from "../../../receipt-import-management/ui/receipt-import-management-form-list-material-item";
import { Specification } from "@/features/specification/type/specificationType";
import { useEffect, useState } from "react";
import {  getReceiptById } from "@/features/receipt/api/receiptApi";
import { ReceiptImportManagementFormListProductItem } from "../../../receipt-import-management/ui/receipt-import-management-form-list-product-item";
import { toast } from "react-toastify";
import { createInventory, removeInventory } from "@/features/inventory/api/inventoryApi";
import { showModal } from "@/shared/store/appSlice";
import { useAppDispatch } from "@/shared/hooks/useAppHook";

export const ReceiptApprovePendingManagementFormAddEdit = ({users, rid, specifications, fetchAllReceipt}: ReceiptApprovePendingManagementFormAddEditProps) => {
    const theme = useTheme();
    const { register,  formState: { errors }, control, handleSubmit, reset } = useForm<InventoryData>();
    const [receipt, setReceipt] = useState<ReceiptData>();
    const [selectStatus, setSelectStatus] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    // Hiển thị thông tin phiếu
    useEffect(() => {
        if(!rid) return;
        const fetchReceipt = async () => {
            const response = await getReceiptById(rid);
            if(response.success) setReceipt(response.data);
        }
        fetchReceipt();
    },[rid]);
    // Lựa chọn trạng thái
    const handleSelectStatus = async(id: string | number) => {
        setSelectStatus(id as string);
    }
    console.log(selectStatus);
    
    //  Xử lý duyệt phiếu
    const handleApprove = async (data: InventoryData) => {
        if (!rid) return;

        try {
            let payload: InventoryData;

            if (receipt?.typeReceipt === 'import') {
                if (receipt?.materials && receipt.materials.length > 0) {
                    // Tích hợp location vào từng material
                    const materialsWithLocation = receipt.materials.map((material) => {
                        const locationKey = `material_${material.mid}_location`;
                        const positionCodeKey = `material_${material.mid}_positionCode`;
                        return {
                            ...material,
                            location: {
                                shelf: data[locationKey] || '',
                                positionCode: data[positionCodeKey] || ''
                            }
                        } as InventoryMaterialData;
                    });

                    payload = {
                        rid: rid,
                        approvedBy: data.approvedBy,
                        status: data.status,
                        materials: materialsWithLocation,
                    };
                } else if (receipt?.products && receipt.products.length > 0) {
                    // Tương tự cho products nếu cần
                    const productsWithLocation = receipt.products.map((product) => {
                        const locationKey = `product_${product.pid}_location`;
                        const positionCodeKey = `product_${product.pid}_positionCode`;
                        
                        return {
                            ...product,
                            location: {
                                shelf: data[locationKey] || '',
                                positionCode: data[positionCodeKey] || ''
                            }
                        } as InventoryProductData;
                    });

                    payload = {
                        rid: rid,
                        approvedBy: data.approvedBy,
                        status: data.status,
                        products: productsWithLocation,
                    };
                } else {
                    toast.error("Không có nguyên liệu hoặc sản phẩm để duyệt.");
                    return;
                }
                dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
                const response = await createInventory(payload);
                if (response.success){ 
                    dispatch(showModal({ isShowModal: false, modalType: null }));
                    toast.success(response.message); 
                    reset();
                    if(fetchAllReceipt){
                        fetchAllReceipt();
                    }
                }
            } else if (receipt?.typeReceipt === 'export') {
                if (receipt?.materials && receipt.materials.length > 0) {
                    payload = {
                        rid: rid,
                        approvedBy: data.approvedBy,
                        status: data.status,
                        materials: receipt.materials,
                    };
                } else if (receipt?.products && receipt.products.length > 0) {
                    // Tương tự cho products nếu cần
                    payload = {
                        rid: rid,
                        approvedBy: data.approvedBy,
                        status: data.status,
                        products: receipt.products,
                    };
                } else {
                    toast.error("Không có nguyên liệu hoặc sản phẩm để duyệt.");
                    return;
                }
                dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
                const response = await removeInventory(payload);
                if (response.success){ 
                    dispatch(showModal({ isShowModal: false, modalType: null }));
                    toast.success(response.message); 
                    reset();
                    if(fetchAllReceipt){
                        fetchAllReceipt();
                    }
                }
            } else {
                dispatch(showModal({ isShowModal: false, modalType: null }));
                toast.error('Lỗi không xác định');
                reset();
                    if(fetchAllReceipt){
                        fetchAllReceipt();
                    }
            }
        } catch (error: unknown) {
            dispatch(showModal({ isShowModal: false, modalType: null }));
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage);
            if(fetchAllReceipt){
                fetchAllReceipt();
            }
            reset();
        }
    };

    // Người kiểm duyệt
    const approveBy = users?.filter(el => el.role === '2006');
    return(
        <Box>
            <Box sx={{
                backgroundColor: theme.palette.primary.light,
                py: 2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold
            }}>
                <Typography variant='body2'>
                    {receipt?.typeReceipt ==='import' ? 'Kiểm duyệt phiếu nhập kho' : 'Kiểm duyệt phiếu xuất kho'}
                </Typography>
            </Box>
            <Box>
                <form onSubmit={handleSubmit(handleApprove)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <Box sx={{display: 'flex', justifyContent: 'space-between', gap:2}}>
                    <ControlledSelect
                        label='Người kiểm duyệt'
                        placeholder='Người kiểm duyệt'
                        important
                        sx={{width: "50%"}}
                        name='approvedBy'
                        control={control}
                        options={approveBy || []}
                        rules={{ required: 'Vui lòng chọn người kiểm duyệt' }}
                    />
                    <ControlledSelect
                        label='Trạng thái xét duyệt'
                        placeholder='Lựa chọn trạng thái'
                        important
                        onSelectionChange={handleSelectStatus}
                        sx={{width: "50%"}}
                        name='status'
                        control={control}
                        options={ReceiptStatus.filter(el => el._id !== 'pending')}
                        rules={{ required: 'Vui lòng chọn trạng thái' }}
                    />
                </Box>
                
                {selectStatus === 'confirmed' && receipt?.typeReceipt ==='import' && receipt?.materials && receipt?.materials?.length > 0 && <Typography>Chọn vị trí cho nguyên liệu:</Typography>}
                {selectStatus === 'confirmed' && receipt?.typeReceipt ==='import' && receipt?.materials && receipt?.materials?.length > 0 && receipt?.materials.map(el => (
                    <Box key={el.mid} sx={{display: 'flex', justifyContent: 'space-between', gap:2, alignItems: 'flex-end'}}>
                        <Box sx={{width: "33%"}}>
                            <Typography variant="body2" sx={{mb: 1, fontWeight: 'bold'}}>
                                {el.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Mã: {el.mid}
                            </Typography>
                        </Box>
                        
                        <ControlledSelect
                            label='Vị trí kệ'
                            placeholder='Lựa chọn vị trí kệ'
                            important
                            sx={{width: "33%"}}
                            name={`material_${el.mid}_location`}
                            control={control}
                            options={shelfLocation}
                            rules={{ required: 'Vui lòng chọn vị trí kệ' }}
                        />
                        
                        <InventoryFormInput
                            label='Mã vị trí'
                            placeholder='Thêm mã vị trí'
                            important
                            sx={{width: "33%"}}
                            id={`material_${el.mid}_positionCode`}
                            register={register as UseFormRegister<InventoryData>}
                            errors={errors as FieldErrors<InventoryData>}
                            validate={{
                                required: 'Mã vị trí không được để trống',
                                minLength: {
                                    value: 3,
                                    message: 'Mã vị trí phải có ít nhất 3 ký tự'
                                }
                            }}
                        />
                    </Box>
                ))}
                
                {receipt?.materials && receipt?.materials?.length > 0 &&
                    <ReceiptImportManagementFormListMaterialItem 
                        action='show' 
                        materialReceipt={receipt?.materials as ReceiptMaterialData[]} 
                        specifications={specifications as Specification[]}
                    />
                }
                
                {selectStatus === 'confirmed' && receipt?.typeReceipt ==='import' && receipt?.products && receipt?.products?.length > 0 &&  <Typography>Chọn vị trí cho sản phẩm:</Typography>}
                {selectStatus === 'confirmed' && receipt?.typeReceipt ==='import' && receipt?.products && receipt?.products?.length > 0 && receipt?.products.map(el => (
                    <Box key={el.pid} sx={{display: 'flex', justifyContent: 'space-between', gap:2, alignItems: 'flex-end'}}>
                        <Box sx={{width: "33%"}}>
                            <Typography variant="body2" sx={{mb: 1, fontWeight: 'bold'}}>
                                {el.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Mã: {el.pid}
                            </Typography>
                        </Box>
                        
                        <ControlledSelect
                            label='Vị trí kệ'
                            placeholder='Lựa chọn vị trí kệ'
                            important
                            sx={{width: "33%"}}
                            name={`product_${el.pid}_location`}
                            control={control}
                            options={shelfLocation}
                            rules={{ required: 'Vui lòng chọn vị trí kệ' }}
                        />
                        
                        <InventoryFormInput
                            label='Mã vị trí'
                            placeholder='Thêm mã vị trí'
                            important
                            sx={{width: "33%"}}
                            id={`product_${el.pid}_positionCode`}
                            register={register as UseFormRegister<InventoryData>}
                            errors={errors as FieldErrors<InventoryData>}
                            validate={{
                                required: 'Mã vị trí không được để trống',
                                minLength: {
                                    value: 3,
                                    message: 'Mã vị trí phải có ít nhất 3 ký tự'
                                }
                            }}
                        />
                    </Box>
                ))}
                
                {receipt?.products && receipt?.products?.length > 0 &&
                    <ReceiptImportManagementFormListProductItem 
                        action='show' 
                        productReceipt={receipt?.products as ReceiptProductData[]} 
                        specifications={specifications as Specification[]}
                    />
                }
                
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name={receipt?.typeReceipt === 'import' ? 'Duyệt phiếu nhập kho' : 'Duyệt phiếu xuất kho'}
                    />
                </Box>
            </form>
            </Box>
        </Box>
    )
}