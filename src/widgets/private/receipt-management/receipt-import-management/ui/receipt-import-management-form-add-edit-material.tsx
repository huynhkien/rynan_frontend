import { createReceiptImport, getAllReceipt, getReceiptById, updateReceipt } from "@/features/receipt/api/receiptApi";
import ReceiptFormInput from "@/features/receipt/components/ReceiptFormInput";
import { ReceiptData, ReceiptMaterialData } from "@/features/receipt/type/receiptType";
import { removeAllMaterialReceipt } from "@/features/user/store/userSlice";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { PaymentMethods, PaymentStatuses, ReceiptStatus } from "@/shared/constant/common";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppHook";
import { Box, Button, Divider, Paper, Typography, useTheme } from "@mui/material";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";
import { ReceiptImportManagementFormAddEditMaterialItem } from "./receipt-import-management-form-add-edit-material-item";
import { ReceiptImportManagementFormListMaterialItem } from "./receipt-import-management-form-list-material-item";
import { useCallback, useEffect, useState } from "react";
import { ReceiptImportManagementFormListSupplier } from "./receipt-import-management-form-list-supplier";
import { UserData } from "@/features/user/type/userTypes";
import { getAllUser } from "@/features/user/api/userApis";
import { getAllSupplier, getSupplierById } from "@/features/supplier/api/supplierApi";
import { SupplierData } from "@/features/supplier/type/supplierType";
import { MaterialData } from "@/features/material/type/materialType";
import { getAllMaterial, getMaterialById } from "@/features/material/api/materialApi";
import { Specification } from "@/features/specification/type/specificationType";
import { getAllSpecification } from "@/features/specification/api/specificationApi";
import { useParams } from "next/navigation";

export const ReceiptImportManagementFormAddEditMaterial = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {materialReceipt} = useAppSelector((state) => state.user); 
    const {id} = useParams();
    const [users, setUsers] = useState<UserData[]>();
    const [receipts, setReceipts] = useState<ReceiptData[]>();
    const [receipt, setReceipt] = useState<ReceiptData>();
    const [suppliers, setSuppliers] = useState<SupplierData[]>();
    const [supplier, setSupplier] = useState<SupplierData>();
    const [materials, setMaterials] = useState<MaterialData[]>();
    const [material, setMaterial] = useState<MaterialData>();
    const [specifications, setSpecifications] = useState<Specification[]>();
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    // State quản lý mã 
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);
    const { register, formState: { errors }, control, reset, handleSubmit, setValue} = useForm<ReceiptData>();
    // Hiển thị thông tin người dùng
    const fetchUsers = async () => {
        const response = await getAllUser();
        if(response.success) setUsers(response.data);
    }
    // Hiển thị thông tin phiếu
    const fetchReceipts = async() => {
        const response = await getAllReceipt();
        if(response.success) setReceipts(response.data);
    }
    // Hiển thị thông tin nhà cung cấp
    const fetchSuppliers = async() => {
        const response = await getAllSupplier();
        if(response.success) setSuppliers(response.data);
    }
    // Hiển thị thông tin nguyên liệu
    const fetchMaterials = async () => {
        const response = await getAllMaterial();
        if(response.success) setMaterials(response.data)
    }
    // Hiển thị thông tin chi tiết quy cách
    const fetchSpecifications = async() => {
        const response = await getAllSpecification();
        if(response.success) setSpecifications(response.data);
    } 
    // Hiển thị thông tin chi tiết nhà cung cấp
    useEffect(() => {
        if(!selectedSupplier) return;
        const fetchSupplier = async() => {
            const response = await getSupplierById(selectedSupplier as string);
            if(response.success) setSupplier(response.data);
        }
        fetchSupplier();
    },[selectedSupplier])
    // Hiển thị thông tin chi tiết nhà vật liệu
    useEffect(() => {
        if(!selectedMaterial) return;
        const fetchMaterial = async() => {
            const response = await getMaterialById(selectedMaterial as string);
            if(response.success) setMaterial(response.data);
        }
        fetchMaterial();
    },[selectedMaterial])
    useEffect(() => {
        fetchUsers();
        fetchReceipts();
        fetchSuppliers();
        fetchMaterials();
        fetchSpecifications();
    },[]);
    // Lựa chọn nhà cung cấp
    const handleSelectSupplier = (id: string | number) => {
        setSelectedSupplier(id as string);
    }
    // Lựa chọn vật liệu
    const handleSelectMaterial = (id: string | number) => {
        setSelectedMaterial(id as string);
    }
    const staff = users?.filter((el) => ['2002', '2004'].includes(el.role as string));
    // Tính tổng đơn hàng
    const totalMaterial = materialReceipt.reduce((sum, item) => {
        return sum + (item.quantity * (item.price as number))
    }, 0);
    // Tạo mã đơn
    const handleGenerateCode = useCallback(() => {
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2); 
        let nextNumber = lastCodeNumber + 1;
        let newCode = '';

        // Tạo mã mới và kiểm tra trùng lặp
        while (true) {
            const paddedNumber = nextNumber.toString().padStart(3, '0');
            newCode = `RYNANIM${yearSuffix}-${paddedNumber}`;

            // Nếu không bị trùng thì dừng lại
            const isDuplicate = receipts?.some((el) => el.code === newCode);
            if (!isDuplicate) break;

            nextNumber += 1; 
        }

        setLastCodeNumber(nextNumber);
        setValue('code', newCode);
    }, [receipts, lastCodeNumber, setValue]);
    const handleAddReceiptImport = async(data: ReceiptData) => {
        try{
            const newDataReceipt = {
                staff: data.staff,
                status: 'pending',
                supplier: data.supplier,
                materials: materialReceipt,
                typeReceipt: 'import',
                code: data.code,
                total: parseInt(totalMaterial.toString(), 10),
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                note: data.note
            }
            console.log(newDataReceipt)
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
    // Cập nhật thông tin nhập kho
        // Hiển thị thông tin chi tiết nhập kho
        const fetchReceipt =useCallback(async () => {
            if (!id) return;
            const response = await getReceiptById(id as string);
            if (response.success && response.data) {
                reset({
                    code: response.data.code || '',
                    staff: response.data.staff || '',
                    supplier: response.data.supplier || '',
                    note: response.data.note || '',
                    status: ReceiptStatus.find(el => el._id === response?.data?.status)?.name || '',
                    paymentMethod: response.data.paymentMethod || '',
                    paymentStatus: response.data.paymentStatus || '',
                });
                    setReceipt(response.data);
                    setSelectedSupplier(response.data.supplier as string);
            };
    }, [id, reset]); 
    useEffect(() => {
        fetchReceipt();
    },[fetchReceipt]);
    // Cập nhật lại tôi đơn hàng
    const materialTotalId =receipt?.materials?.reduce((sum, item) => {
        return sum + ((item.price as number )* item.quantity)
    },0);
    const receiptTotalUpdate = totalMaterial + (materialTotalId as number);
    const handleUpdateReceiptImport = async(data: ReceiptData) => {
        const mergedMaterialsData = [...materialReceipt as ReceiptMaterialData[], ...receipt?.materials as ReceiptMaterialData[]];
        const temp: Record<string, ReceiptMaterialData> = {};
        mergedMaterialsData.forEach((item) => {
            if(temp[item.mid as string]) {
                temp[item.mid as string].quantity += item.quantity;
            } else {
                temp[item.mid as string] = {...item};
            }
        });
        const materialsData = Object.values(temp);
        try{
            const newDataReceipt = {
                staff: data.staff,
                status: 'pending',
                supplier: data.supplier,
                materials: materialsData,
                typeReceipt: 'import',
                code: data.code,
                total: receiptTotalUpdate,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                note: data.note
            }
            console.log(newDataReceipt)
            const response = await updateReceipt(newDataReceipt as ReceiptData, id as string);
            if(response.success){
                toast.success(response.message);
                dispatch(removeAllMaterialReceipt());
                fetchReceipts();
                fetchReceipt();                
            }
        }catch(error){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }
    return (
         <form onSubmit={handleSubmit(id ? handleUpdateReceiptImport : handleAddReceiptImport)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
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
                                {id ? 
                                <ReceiptFormInput
                                    label='Mã nhập kho'
                                    important
                                    placeholder='Thêm mã nhập kho'
                                    register={register as UseFormRegister<ReceiptData>}
                                    errors={errors as FieldErrors<ReceiptData>}
                                    id='code'
                                    validate={{ required: 'Mã nhập ko không được để trống' }}
                                    sx={{
                                        width: '100%'
                                    }}
                                    disabled
                                />
                                :
                                <>
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
                                    <Button onClick={handleGenerateCode}  sx={{background: theme.palette.primary.main, color: theme.palette.text.secondary}}>
                                        <Typography>Tạo mã</Typography>
                                    </Button>
                                </>  
                            }
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap:2}}>
                                <ControlledSelect
                                    label='Nhân viên xử lý'
                                    placeholder='Lựa chọn nhân viên xử lý'
                                    important
                                    sx={{width: "50%"}}
                                    name='staff'
                                    control={control}
                                    options={staff as UserData[] || []}
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
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
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
                                onSelectionChange={handleSelectSupplier}
                                name='supplier'
                                control={control}
                                options={suppliers?.map(el => ({
                                    _id: el._id as string,
                                    name: el.name
                                })) || []}
                                rules={{ required: 'Vui lòng chọn nhà cung cấp' }}
                            />
                            <ReceiptImportManagementFormListSupplier supplier = {supplier as SupplierData}/>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Lựa chọn nguyên liệu cần nhập
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormAddEditMaterialItem materialReceipt={materialReceipt} handleSelectMaterial={handleSelectMaterial} materials={materials} material={material} specifications={specifications} receipt={receipt}/>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin nguyên liệu 
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormListMaterialItem materialReceipt={materialReceipt} specifications={specifications as Specification[]}/>
                    </Paper>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                        <Paper sx={{ 
                            width: '50%', 
                            borderRadius: 0, 
                            backgroundColor: theme.palette.background.paper 
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
                                            {id ? receiptTotalUpdate.toLocaleString() : totalMaterial.toLocaleString()} VNĐ
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
                                             {id ? receiptTotalUpdate.toLocaleString() : totalMaterial.toLocaleString()} VNĐ
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
                        <Paper sx={{ 
                            width: '50%', 
                            borderRadius: 0, 
                            backgroundColor: theme.palette.background.paper 
                        }}>
                            <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                                <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                    Thông tin nguyên liệu tồn tại trong nhập kho
                                </Typography>
                            </Box>
                            <ReceiptImportManagementFormListMaterialItem materialReceipt={receipt?.materials || []} specifications={specifications as Specification[]} materialId={id as string} render={fetchReceipt}/>
                        </Paper>
                    </Box>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant='outlined' onClick={() => reset()}>
                    Reset Form
                </Button>
                <Button type='submit' variant='contained'>
                    Lưu thông tin
                </Button>
            </Box>
        </form>
    )
}