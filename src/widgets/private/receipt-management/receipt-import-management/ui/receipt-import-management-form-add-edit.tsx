'use client'

import { Box, Paper, Tab, Tabs, Typography, useTheme, Button as ButtonItem, Divider } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { ReceiptData, ReceiptImportManagementFormAddEditMaterialProps} from "@/features/receipt/type/receiptType";
import ReceiptFormInput from "@/features/receipt/components/ReceiptFormInput";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { UserData } from "@/features/user/type/userTypes";
import { getAllUser } from "@/features/user/api/userApis";
import { PaymentMethods, PaymentStatuses, ReceiptStatus } from "@/shared/constant/common";
import { SupplierData } from "@/features/supplier/type/supplierType";
import { getAllSupplier, getSupplierById } from "@/features/supplier/api/supplierApi";
import { ReceiptImportManagementFormListSupplier } from "./receipt-import-management-form-list-supplier";
import { getAllMaterial, getMaterialById } from "@/features/material/api/materialApi";
import { MaterialData } from "@/features/material/type/materialType";
import { ReceiptImportManagementFormAddEditMaterialItem } from "./receipt-import-management-form-add-edit-material-item";
import { Specification } from "@/features/specification/type/specificationType";
import { getAllSpecification } from "@/features/specification/api/specificationApi";
import { ReceiptImportManagementFormListMaterialItem } from "./receipt-import-management-form-list-material-item";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppHook";
import { createReceiptImport, getAllReceipt } from "@/features/receipt/api/receiptApi";
import { toast } from "react-toastify";
import { removeAllMaterialReceipt } from "@/features/user/store/userSlice";

const ReceiptImportManagementFormAddEditMaterial = ({receipts, users, materialReceipt, specifications, supplier, suppliers, materials, material, handleSelectUser, handleSelectMaterial}: ReceiptImportManagementFormAddEditMaterialProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const staff = users.filter((el) => ['2002', '2004'].includes(el.role as string));
    // State quản lý mã 
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);
    const { register, formState: { errors }, control, reset, handleSubmit, setValue} = useForm<ReceiptData>();
    // Tính tổng đơn hàng
    const totalMaterial = materialReceipt.reduce((sum, item) => {
        return sum + (item.quantity * (item.price as number))
    }, 0);
    // Tạo mã đơn
    const handleGenerateCode = useCallback(() => {
        if (receipts?.length === 0) {
            setValue('code', 'RYNAN25-RI01');
            setLastCodeNumber(1);
            return;
        }
        
        let newNumber = lastCodeNumber + 1;
        let newCode = `RYNAN25-RI0${newNumber}`;
        
        while (receipts?.some((el) => el.code === newCode)) {
            newNumber += 1;
            newCode = `RYNAN25-RI0${newNumber}`;
        }
        
        setLastCodeNumber(newNumber);
        setValue('code', newCode);
    }, [receipts, lastCodeNumber, setValue]);
    // Xử lý tạo đơn hàng
    const handleAddReceiptImport = async(data: ReceiptData) => {
        try{
            const newDataReceipt = {
            staff: data.staff,
            status: 'pending',
            supplier: data.supplier,
            materials: materialReceipt,
            typeReceipt: 'import',
            code: data.code,
            total: totalMaterial,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus
            }
            const response = await createReceiptImport(newDataReceipt as ReceiptData);
            if(response.success){
                toast.success(response.message);
                dispatch(removeAllMaterialReceipt());
                reset();
                
            }
        }catch(error){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }
    return (
         <form onSubmit={handleSubmit(handleAddReceiptImport)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nhập kho
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                            {/* Nhà cung cấp */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <ReceiptFormInput
                                    label='Mã nhập kho'
                                    important
                                    placeholder='Thêm mã nhập kho'
                                    register={register as UseFormRegister<ReceiptData>}
                                    errors={errors as FieldErrors<ReceiptData>}
                                    id='code'
                                    validate={{ required: 'Mã nhập ko không được để trống' }}
                                    sx={{
                                        width: '70%'
                                    }}
                                />
                                <ButtonItem onClick={handleGenerateCode}  sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                    <Typography>Tạo mã</Typography>
                                </ButtonItem>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap:2}}>
                                <ControlledSelect
                                    label='Nhân viên xử lý'
                                    placeholder='Lựa chọn nhân viên xử lý'
                                    important
                                    sx={{width: "50%"}}
                                    name='staff'
                                    control={control}
                                    options={staff}
                                    rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
                                />
                                <ReceiptFormInput
                                    label='Trạng thái xử lý'
                                    placeholder='Lựa chọn Trạng thái xử lý'
                                    id='status'
                                    disabled
                                    sx={{width: "50%"}}
                                    register={register as UseFormRegister<ReceiptData>}
                                    errors={errors as FieldErrors<ReceiptData>}
                                    defaultValue={ReceiptStatus.find((el) => el._id === 'pending')?.name}
                                />
                            </Box>
                            <ReceiptFormInput
                                label='Ghi chú'
                                placeholder='Ghi chú(nếu có)'
                                id='note'
                                register={register as UseFormRegister<ReceiptData>}
                                errors={errors as FieldErrors<ReceiptData>}
                                multiline
                                rows={15}
                            />
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nhà cung cấp
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                            {/* Nhà cung cấp */}
                            <ControlledSelect
                                label='Lựa chọn nhà cung cấp'
                                placeholder='Lựa chọn nhà cung cấp'
                                important
                                onSelectionChange={handleSelectUser}
                                name='supplier'
                                control={control}
                                options={suppliers?.map(el => ({
                                    _id: el?._id as string,
                                    name: el?.name
                                }))}
                                rules={{ required: 'Vui lòng chọn nhà cung cấp' }}
                            />
                            <ReceiptImportManagementFormListSupplier supplier = {supplier}/>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Lựa chọn nguyên liệu cần nhập
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormAddEditMaterialItem materialReceipt={materialReceipt} handleSelectMaterial={handleSelectMaterial} materials={materials} material={material} specifications={specifications}/>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nguyên liệu 
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormListMaterialItem materialReceipt={materialReceipt} specifications={specifications}/>
                    </Paper>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ 
                            width: '50%', 
                            borderRadius: 0, 
                            backgroundColor: theme.palette.background.default 
                        }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant='body2' sx={{ 
                                    color: theme.palette.primary.main, 
                                    mx: 2, 
                                    fontWeight: 'bold' 
                                }}>
                                    Thông tin thanh toán
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                                {/* Tóm tắt đơn hàng */}
                                <Box>
                                    <Typography variant='body1' sx={{ mb: 1, fontWeight: 'bold' }}>
                                        Tóm tắt đơn hàng
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Tạm tính:
                                        </Typography>
                                        <Typography variant='body1'>
                                            {totalMaterial.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Phí vận chuyển:
                                        </Typography>
                                        <Typography variant='body1'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Giảm giá:
                                        </Typography>
                                        <Typography variant='body1' color='success.main'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Thuế (VAT 10%):
                                        </Typography>
                                        <Typography variant='body1'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant='body2' fontWeight='bold'>
                                            Tổng cộng:
                                        </Typography>
                                        <Typography variant='body2' fontWeight='bold' color='primary.main'>
                                            {totalMaterial.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                </Box>
                                {/* Trạng thái thanh toán */}
                                <ControlledSelect
                                    label='Trạng thái thanh toán'
                                    important
                                    name='paymentStatus'
                                    control={control}
                                    options={PaymentStatuses}
                                    rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
                                />

                                {/* Hình thức thanh toán */}
                                <ControlledSelect
                                    label='Hình thức thanh toán'
                                    important
                                    name='paymentMethod'
                                    control={control}
                                    options={PaymentMethods}
                                    rules={{ required: 'Vui lòng chọn hình thức thanh toán' }}
                                />
                            </Box>
                        </Paper>
                    </Box>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <ButtonItem variant='outlined' onClick={() => reset()}>
                    Reset Form
                </ButtonItem>
                <ButtonItem type='submit' variant='contained'>
                    Lưu thông tin
                </ButtonItem>
            </Box>
        </form>
    )
}
const ReceiptImportManagementFormAddEditProduct = ({receipts, users, materialReceipt, specifications, supplier, suppliers, materials, material, handleSelectUser, handleSelectMaterial}: ReceiptImportManagementFormAddEditMaterialProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const staff = users.filter((el) => ['2002', '2004'].includes(el.role as string));
    // State quản lý mã 
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);
    const { register, formState: { errors }, control, reset, handleSubmit, setValue} = useForm<ReceiptData>();
    // Tính tổng đơn hàng
    const totalMaterial = materialReceipt.reduce((sum, item) => {
        return sum + (item.quantity * (item.price as number))
    }, 0);
    // Tạo mã đơn
    const handleGenerateCode = useCallback(() => {
        if (receipts?.length === 0) {
            setValue('code', 'RYNAN25-RI01');
            setLastCodeNumber(1);
            return;
        }
        
        let newNumber = lastCodeNumber + 1;
        let newCode = `RYNAN25-RI0${newNumber}`;
        
        while (receipts?.some((el) => el.code === newCode)) {
            newNumber += 1;
            newCode = `RYNAN25-RI0${newNumber}`;
        }
        
        setLastCodeNumber(newNumber);
        setValue('code', newCode);
    }, [receipts, lastCodeNumber, setValue]);
    // Xử lý tạo đơn hàng
    const handleAddReceiptImport = async(data: ReceiptData) => {
        try{
            const newDataReceipt = {
            staff: data.staff,
            status: 'pending',
            supplier: data.supplier,
            materials: materialReceipt,
            typeReceipt: 'import',
            code: data.code,
            total: totalMaterial,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus
            }
            const response = await createReceiptImport(newDataReceipt as ReceiptData);
            if(response.success){
                toast.success(response.message);
                dispatch(removeAllMaterialReceipt());
                reset();
                
            }
        }catch(error){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }
    return (
         <form onSubmit={handleSubmit(handleAddReceiptImport)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nhập kho
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                            {/* Nhà cung cấp */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <ReceiptFormInput
                                    label='Mã nhập kho'
                                    important
                                    placeholder='Thêm mã nhập kho'
                                    register={register as UseFormRegister<ReceiptData>}
                                    errors={errors as FieldErrors<ReceiptData>}
                                    id='code'
                                    validate={{ required: 'Mã nhập ko không được để trống' }}
                                    sx={{
                                        width: '70%'
                                    }}
                                />
                                <ButtonItem onClick={handleGenerateCode}  sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                    <Typography>Tạo mã</Typography>
                                </ButtonItem>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap:2}}>
                                <ControlledSelect
                                    label='Nhân viên xử lý'
                                    placeholder='Lựa chọn nhân viên xử lý'
                                    important
                                    sx={{width: "50%"}}
                                    name='staff'
                                    control={control}
                                    options={staff}
                                    rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
                                />
                                <ReceiptFormInput
                                    label='Trạng thái xử lý'
                                    placeholder='Lựa chọn Trạng thái xử lý'
                                    id='status'
                                    disabled
                                    sx={{width: "50%"}}
                                    register={register as UseFormRegister<ReceiptData>}
                                    errors={errors as FieldErrors<ReceiptData>}
                                    defaultValue={ReceiptStatus.find((el) => el._id === 'pending')?.name}
                                />
                            </Box>
                            <ReceiptFormInput
                                label='Ghi chú'
                                placeholder='Ghi chú(nếu có)'
                                id='note'
                                register={register as UseFormRegister<ReceiptData>}
                                errors={errors as FieldErrors<ReceiptData>}
                                multiline
                                rows={15}
                            />
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nhà cung cấp
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                            {/* Nhà cung cấp */}
                            <ControlledSelect
                                label='Lựa chọn nhà cung cấp'
                                placeholder='Lựa chọn nhà cung cấp'
                                important
                                onSelectionChange={handleSelectUser}
                                name='supplier'
                                control={control}
                                options={suppliers?.map(el => ({
                                    _id: el?._id as string,
                                    name: el?.name
                                }))}
                                rules={{ required: 'Vui lòng chọn nhà cung cấp' }}
                            />
                            <ReceiptImportManagementFormListSupplier supplier = {supplier}/>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Lựa chọn nguyên liệu cần nhập
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormAddEditMaterialItem materialReceipt={materialReceipt} handleSelectMaterial={handleSelectMaterial} materials={materials} material={material} specifications={specifications}/>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nguyên liệu 
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormListMaterialItem materialReceipt={materialReceipt} specifications={specifications}/>
                    </Paper>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ 
                            width: '50%', 
                            borderRadius: 0, 
                            backgroundColor: theme.palette.background.default 
                        }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant='body2' sx={{ 
                                    color: theme.palette.primary.main, 
                                    mx: 2, 
                                    fontWeight: 'bold' 
                                }}>
                                    Thông tin thanh toán
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                                {/* Tóm tắt đơn hàng */}
                                <Box>
                                    <Typography variant='body1' sx={{ mb: 1, fontWeight: 'bold' }}>
                                        Tóm tắt đơn hàng
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Tạm tính:
                                        </Typography>
                                        <Typography variant='body1'>
                                            {totalMaterial.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Phí vận chuyển:
                                        </Typography>
                                        <Typography variant='body1'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Giảm giá:
                                        </Typography>
                                        <Typography variant='body1' color='success.main'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='body1'>
                                            Thuế (VAT 10%):
                                        </Typography>
                                        <Typography variant='body1'>
                                            0 VNĐ
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant='body2' fontWeight='bold'>
                                            Tổng cộng:
                                        </Typography>
                                        <Typography variant='body2' fontWeight='bold' color='primary.main'>
                                            {totalMaterial.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                </Box>
                                {/* Trạng thái thanh toán */}
                                <ControlledSelect
                                    label='Trạng thái thanh toán'
                                    important
                                    name='paymentStatus'
                                    control={control}
                                    options={PaymentStatuses}
                                    rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
                                />

                                {/* Hình thức thanh toán */}
                                <ControlledSelect
                                    label='Hình thức thanh toán'
                                    important
                                    name='paymentMethod'
                                    control={control}
                                    options={PaymentMethods}
                                    rules={{ required: 'Vui lòng chọn hình thức thanh toán' }}
                                />
                            </Box>
                        </Paper>
                    </Box>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <ButtonItem variant='outlined' onClick={() => reset()}>
                    Reset Form
                </ButtonItem>
                <ButtonItem type='submit' variant='contained'>
                    Lưu thông tin
                </ButtonItem>
            </Box>
        </form>
    )
}




export const ReceiptImportManagementFormAddEdit = () => {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const {materialReceipt} = useAppSelector((state) => state.user);
    const [users, setUsers] = useState<UserData[] | []>([]);
    const [suppliers, setSuppliers] = useState<SupplierData[] | []>([]);
    const [supplier, setSupplier] = useState<SupplierData>();
    const [materials, setMaterials] = useState<MaterialData[]>();
    const [material, setMaterial] = useState<MaterialData>();
    const [receipts, setReceipts] = useState<ReceiptData[] | []>([]);
    const [specifications, setSpecifications] = useState<Specification[]>();
    const [selectSupplier, setSelectSupplier] = useState<string>();
    const [selectMaterial, setSelectMaterial] = useState<string>();

    // Hiển thị thông tin người dùng
    const fetchUsers = async () => {
        const response = await getAllUser();
        if (response.success) setUsers(response.data);
    };
    const fetchSuppliers = async () => {
        const response = await getAllSupplier();
        if (response.success) setSuppliers(response.data as SupplierData[]);
    };
    const fetchMaterials =async() => {
        const response = await getAllMaterial();
        if(response.success) setMaterials(response.data);
    }
    const fetchSpecifications =async() => {
        const response = await getAllSpecification();
        if(response.success) setSpecifications(response.data);
    }
    const fetchReceipts = async() => {
        const response  =await getAllReceipt();
        setReceipts(response.data || []);
    }
    useEffect(() => {
        fetchUsers();
        fetchSuppliers();
        fetchMaterials();
        fetchSpecifications();
        fetchReceipts();
    },[]);
    // Hiển thị thông tin nhà cung cấp
    useEffect(() => {
        const fetchSupplier = async () => {
            if(!selectSupplier) return;
            const response = await getSupplierById(selectSupplier as string);
            if(response.success) setSupplier(response.data)
        }
        fetchSupplier();
    },[selectSupplier])
    // Hiển thị thông tin nguyên liệu
    useEffect(() => {
        const fetchMaterial = async () => {
            if(!selectMaterial) return;
            const response = await getMaterialById(selectMaterial as string);
            if(response.success) setMaterial(response.data)
        }
        fetchMaterial();
    },[selectMaterial])
    // Tab handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    // lựa chọn nhà cung cấp
    const handleSelectUser = async (id: string | number) => {
        setSelectSupplier(id as string)
    }
    // lựa chọn nhà cung cấp
    const handleSelectMaterial = async (id: string | number) => {
        setSelectMaterial(id as string)
    }

    const getInfoTab = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <ReceiptImportManagementFormAddEditMaterial
                        users={users}
                        suppliers={suppliers}
                        handleSelectUser={handleSelectUser}
                        supplier={supplier as SupplierData}
                        materials={materials as MaterialData[]}
                        handleSelectMaterial={handleSelectMaterial}
                        material={material as MaterialData}
                        specifications={specifications as Specification[]}
                        materialReceipt={materialReceipt}
                        receipts={receipts}
                    />
                );
            case 1:
                return (
                    <ReceiptImportManagementFormAddEditProduct
                        users={users}
                        suppliers={suppliers}
                        handleSelectUser={handleSelectUser}
                        supplier={supplier as SupplierData}
                        materials={materials as MaterialData[]}
                        handleSelectMaterial={handleSelectMaterial}
                        material={material as MaterialData}
                        specifications={specifications as Specification[]}
                        materialReceipt={materialReceipt}
                        receipts={receipts}
                        
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ mb: 2,  }}>
            <Box sx={{ py: 2,  }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    sx={{ width: { xs: '100%', md: '30%' }, py: 2,  }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab sx={{color: theme.palette.text.primary}} label='Nhập kho nguyên liệu' />
                    <Tab sx={{color: theme.palette.text.primary}} label='Nhập kho sản phẩm' />
                </Tabs>
            </Box>
            <Box>{getInfoTab()}</Box>
        </Box>
    );
};
