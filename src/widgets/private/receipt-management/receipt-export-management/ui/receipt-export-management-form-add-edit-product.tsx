import { createReceiptImport, getAllReceipt, getReceiptById, updateReceipt } from "@/features/receipt/api/receiptApi";
import ReceiptFormInput from "@/features/receipt/components/ReceiptFormInput";
import { ReceiptData, ReceiptProductData } from "@/features/receipt/type/receiptType";
import { getAllSpecification } from "@/features/specification/api/specificationApi";
import { getAllUser } from "@/features/user/api/userApis";
import { removeAllProductReceipt } from "@/features/user/store/userSlice";
import { UserData } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { deliveryMethods, PaymentMethods, PaymentStatuses, ReceiptStatus } from "@/shared/constant/common";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppHook";
import { Box, Button, Divider, Paper, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";
import { Specification } from "@/features/specification/type/specificationType";
import { Product } from "@/features/product/type/productType";
import { getAllProduct, getProductById } from "@/features/product/api/productApi";
import { useParams } from "next/navigation";
import { ReceiptExportManagementFormAddEditProductItem } from "./receipt-export-management-form-add-edit-product-item";
import { ReceiptExportManagementFormListUser } from "./receipt-export-management-form-list-user";
import { ReceiptExportManagementFormListProductItem } from "./receipt-export-management-form-list-product-item";

export const ReceiptExportManagementFormAddEditProduct = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {productReceipt} = useAppSelector((state) => state.user); 
    const [users, setUsers] = useState<UserData[]>();
    const [products, setProducts] = useState<Product[]>();
    const [product, setProduct] = useState<Product>();
    const [receipts, setReceipts] = useState<ReceiptData[]>();
    const [receipt, setReceipt] = useState<ReceiptData>();
    const [specifications, setSpecifications] = useState<Specification[]>();
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const {id} = useParams();
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
    // Hiển thị thông tin sản phẩm
    const fetchProducts = async() => {
        const response = await getAllProduct();
        if(response.success) setProducts(response.data);
    }
    // Hiển thị thông tin chi tiết quy cách
    const fetchSpecifications = async() => {
        const response = await getAllSpecification();
        if(response.success) setSpecifications(response.data);
    } 
    // Hiển thị thông tin chi tiết nhà vật liệu
    useEffect(() => {
        if(!selectedProduct) return;
        const fetchProduct = async() => {
            const response = await getProductById(selectedProduct as string);
            if(response.success) setProduct(response.data);
        }
        fetchProduct();
    },[selectedProduct])
    useEffect(() => {
        fetchUsers();
        fetchReceipts();
        fetchSpecifications();
        fetchProducts();
    },[]);
    // Lựa chọn nhà khách hàng
    const handleSelectUser = (id: string | number) => {
        setSelectedUser(id as string);
    }
    // Lựa chọn vật liệu
    const handleSelectProduct = (id: string | number) => {
        setSelectedProduct(id as string);
    }
    const staff = users?.filter((el) => ['2002', '2004', '2006'].includes(el.role as string));
    // State quản lý mã 
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);
    const { register, formState: { errors }, control, reset, setValue, handleSubmit} = useForm<ReceiptData>();
    // Tạo mã đơn
    console.log(receipts);
    const handleGenerateCode = useCallback(() => {
        if (receipts?.length === 0) {
            setValue('code', 'RYNAN25-REP01');
            setLastCodeNumber(1);
            return;
        }
        let newNumber = lastCodeNumber + 1;
        let newCode = `RYNAN25-REP0${newNumber}`;
        
        while (receipts?.some((el) => el.code === newCode)) {
            newNumber += 1;
            newCode = `RYNAN25-REP0${newNumber}`;
        }
        
        setLastCodeNumber(newNumber);
        setValue('code', newCode);
    }, [receipts, lastCodeNumber, setValue]);
    // Tính tổng đơn hàng
    const totalProduct = productReceipt.reduce((sum, item) => {
        return sum + (item.quantity * (item.price as number))
    }, 0);
    // Cập nhật lại tôi đơn hàng
    const productTotalId =receipt?.products?.reduce((sum, item) => {
        return sum + ((item.price as number )* item.quantity)
    },0);
    const receiptTotalUpdate = totalProduct + (productTotalId as number);
        // Xử lý tạo đơn hàng
    const handleAddReceiptImport = async(data: ReceiptData) => {
        try{
            const newDataReceipt = {
                staff: data.staff,
                status: 'pending',
                exportedTo: selectedUser,
                products: productReceipt,
                typeReceipt: 'export',
                code: data.code,
                total: parseInt(totalProduct.toString(), 10),
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                deliveryDate: data.deliveryDate,
                deliveryMethod: data.deliveryMethod,
                paymentDueDate: data.paymentDueDate,
                produced_at: data.produced_at,
                note: data.note
            }
            const response = await createReceiptImport(newDataReceipt as ReceiptData);
            if(response.success){
                toast.success(response.message);
                dispatch(removeAllProductReceipt());
                reset();
                
            }
        }catch(error){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }

    // Cập nhật thông tin
    // Hiển thị thông tin chi tiết nhập kho
    const fetchReceipt = useCallback(async () => {
        if (!id) return;
        const response = await getReceiptById(id as string);
        if (response.success && response.data) {
            reset({
                code: response.data.code || '',
                    produced_at: response.data.produced_at || '',
                    deliveryMethod: response.data.deliveryMethod,
                    deliveryDate: (response.data.deliveryDate as string).split('T')[0],
                    paymentDueDate: (response.data.paymentDueDate as string).split('T')[0],
                    staff: response.data.staff || '',
                    exportedTo: response.data.exportedTo || '',
                    note: response.data.note || '',
                    status: ReceiptStatus.find(el => el._id === response?.data?.status)?.name || '',
                    paymentMethod: response.data.paymentMethod || '',
                    paymentStatus: response.data.paymentStatus || '',
            });
                setReceipt(response.data);
                setSelectedUser(response.data.exportedTo as string)
    };
    }, [id, reset]); 
    useEffect(() => {
        fetchReceipt();
    },[fetchReceipt]);
    const handleUpdateProductImport = async(data: ReceiptData) => {
            const mergedProductsData = [...productReceipt as ReceiptProductData[], ...receipt?.products as ReceiptProductData[]];
            const temp: Record<string, ReceiptProductData> = {};
            mergedProductsData.forEach((item) => {
                if(temp[item.pid as string]) {
                    temp[item.pid as string].quantity += item.quantity;
                } else {
                    temp[item.pid as string] = {...item};
                }
            });
            const ProductsData = Object.values(temp);
            try{
                const newDataReceipt = {
                    staff: data.staff,
                    status: 'pending',
                    exportedTo: selectedUser,
                    products: ProductsData,
                    typeReceipt: 'export',
                    code: data.code,
                    total: receiptTotalUpdate,
                    paymentMethod: data.paymentMethod,
                    paymentStatus: data.paymentStatus,
                    deliveryDate: data.deliveryDate,
                    deliveryMethod: data.deliveryMethod,
                    paymentDueDate: data.paymentDueDate,
                    produced_at: data.produced_at,
                    note: data.note
                }
                console.log(newDataReceipt)
                const response = await updateReceipt(newDataReceipt as ReceiptData, id as string);
                if(response.success){
                    toast.success(response.message);
                    dispatch(removeAllProductReceipt());
                    fetchReceipts();
                    fetchReceipt();                
                }
            }catch(error){
                const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
                toast.error(errorMessage)
            }
        }
    return (
         <form onSubmit={handleSubmit(id? handleUpdateProductImport : handleAddReceiptImport)}
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
                            <ReceiptFormInput
                                    label='Công ty'
                                    disabled
                                    id='produced_at'
                                    defaultValue={'Công ty Rynan Smart Agriculture'}
                                    register={register as UseFormRegister<ReceiptData>}
                                    errors={errors as FieldErrors<ReceiptData>}
                                />
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
                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap:2}}>
                                <ControlledSelect
                                    label='Hình thức vận chuyển'
                                    placeholder='Lựa chọn hình thức vận chuyển'
                                    important
                                    sx={{width: "50%"}}
                                    name='deliveryMethod'
                                    control={control}
                                    options={deliveryMethods}
                                    rules={{ required: 'Vui lòng chọn hình thức vận chuyển' }}
                                />
                                <ReceiptFormInput
                                    label='Ngày dự kiến giao hàng'
                                    type='date'
                                    id='deliveryDate'
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
                                rows={5}
                            />
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin khách hàng
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                            {/* Khách hàng */}
                            <ControlledSelect
                                label='Lựa chọn khách hàng'
                                placeholder='Lựa chọn khách hàng'
                                important
                                onSelectionChange={handleSelectUser}
                                name='exportedTo'
                                control={control}
                                options={users?.filter(el => ['2000'].includes(el.role as string))?.map(el => ({
                                    _id: el._id as string,
                                    name: el.name
                                })) || []}
                            />
                            <ReceiptExportManagementFormListUser user={users?.find(el => el._id === selectedUser) as UserData}/>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Lựa chọn sản phẩm cần nhập
                            </Typography>
                        </Box>
                        <ReceiptExportManagementFormAddEditProductItem product={product} specifications={specifications} products={products} handleSelectProduct={handleSelectProduct} productReceipt={productReceipt} receipt={receipt} />
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin sản phẩm 
                            </Typography>
                        </Box>
                        <ReceiptExportManagementFormListProductItem productReceipt={productReceipt as ReceiptProductData[]} specifications={specifications as Specification[]}/>
                    </Paper>
                </Box>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt:2, gap: 2 }}>
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
                                        {id ? receiptTotalUpdate.toLocaleString() : totalProduct.toLocaleString()} VNĐ
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
                                         {id ? receiptTotalUpdate.toLocaleString() : totalProduct.toLocaleString()} VNĐ
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
                            {/* Hạn thanh toán */}
                             <ReceiptFormInput
                                label='Hạn thanh toán'
                                type='date'
                                id='paymentDueDate'
                                register={register as UseFormRegister<ReceiptData>}
                                errors={errors as FieldErrors<ReceiptData>}
                                defaultValue={ReceiptStatus.find((el) => el._id === 'pending')?.name}
                            />
                            </Box>
                        </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin sản phẩm tồn tại trong nhập kho
                            </Typography>
                        </Box>
                        <ReceiptExportManagementFormListProductItem productReceipt={receipt?.products as ReceiptProductData[]} specifications={specifications as Specification[]} receipt={receipt} render={fetchReceipt} materialId={id as string}/>
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