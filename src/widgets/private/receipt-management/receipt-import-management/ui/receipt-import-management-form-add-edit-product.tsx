import { createReceiptImport, getAllReceipt, getReceiptById, updateReceipt } from "@/features/receipt/api/receiptApi";
import ReceiptFormInput from "@/features/receipt/components/ReceiptFormInput";
import { ReceiptData, ReceiptProductData } from "@/features/receipt/type/receiptType";
import { getAllSpecification } from "@/features/specification/api/specificationApi";
import { getAllUser } from "@/features/user/api/userApis";
import { removeAllProductReceipt } from "@/features/user/store/userSlice";
import { UserData } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { ReceiptStatus } from "@/shared/constant/common";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppHook";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";
import { Specification } from "@/features/specification/type/specificationType";
import { Product } from "@/features/product/type/productType";
import { getAllProduct, getProductById } from "@/features/product/api/productApi";
import { useParams } from "next/navigation";
import { ReceiptImportManagementFormAddEditProductItem } from "./receipt-import-management-form-add-edit-product-item";
import { ReceiptImportManagementFormListProductItem } from "./receipt-import-management-form-list-product-item";

export const ReceiptImportManagementFormAddEditProduct = () => {
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
    // Lựa chọn vật liệu
    const handleSelectProduct = (id: string | number) => {
        setSelectedProduct(id as string);
    }
    const staff = users?.filter((el) => ['2002', '2004', '2006'].includes(el.role as string));
    // State quản lý mã 
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);
    const { register, formState: { errors }, control, reset, setValue, handleSubmit} = useForm<ReceiptData>();
    // Tạo mã đơn
    const handleGenerateCode = useCallback(() => {
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2); 
        let nextNumber = lastCodeNumber + 1;
        let newCode = '';

        // Tạo mã mới và kiểm tra trùng lặp
        while (true) {
            const paddedNumber = nextNumber.toString().padStart(3, '0');
            newCode = `RYNANIP${yearSuffix}-${paddedNumber}`;

            // Nếu không bị trùng thì dừng lại
            const isDuplicate = receipts?.some((el) => el.code === newCode);
            if (!isDuplicate) break;

            nextNumber += 1; 
        }

        setLastCodeNumber(nextNumber);
        setValue('code', newCode);
    }, [receipts, lastCodeNumber, setValue]);
        // Xử lý tạo đơn hàng
    const handleAddReceiptImport = async(data: ReceiptData) => {
        try{
            const newDataReceipt = {
                staff: data.staff,
                status: 'pending',
                products: productReceipt,
                produced_at: 'Công ty Rynan Smart Agiculture',
                typeReceipt: 'import',
                code: data.code,
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
                staff: response.data.staff || '',
                supplier: response.data.supplier || '',
                note: response.data.note || '',
                status: ReceiptStatus.find(el => el._id === response?.data?.status)?.name || '',
            });
                setReceipt(response.data);
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
                    products: ProductsData,
                    typeReceipt: 'import',
                    code: data.code,
                    produced_at: 'Công ty Rynan Smart Agiculture',
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
    // Thông tin sản xuất
    const info = [
        {
            label: 'Sản xuất tại',
            value: 'Công ty Rynan Smart Agriculture'
        },
        {
            label: 'Địa chỉ',
            value: 'Khu CN Long Đức, ấp Vĩnh Yên, Phường Long Đức, Tỉnh Vĩnh Long'
        }
    ]
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
                                rows={5}
                            />
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin sản xuất
                            </Typography>
                        </Box>
                        {info.map((el) => (
                        <Box sx={{ display: 'flex', alignItems: 'center',gap: 2, py: 2, px: 1,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                borderRadius: 1
                              }
                            }}
                            key={el.label}>
                            <Typography 
                              variant='body1' 
                              sx={{ 
                                fontWeight: 600, 
                                minWidth: '140px',
                              }}
                            >
                                {el.label}:
                            </Typography>
                            <Typography 
                              variant='body1' 
                              sx={{ 
                                flex: 1,
                                wordBreak: 'break-word'
                              }}
                            >
                              {el.value || <span style={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>Chưa cập nhật</span>}
                            </Typography>
                        </Box>
                        ))}
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
                        <ReceiptImportManagementFormAddEditProductItem product={product} specifications={specifications} products={products} handleSelectProduct={handleSelectProduct} productReceipt={productReceipt} receipt={receipt} />
                    </Paper>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin sản phẩm 
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormListProductItem productReceipt={productReceipt as ReceiptProductData[]} specifications={specifications as Specification[]}/>
                    </Paper>
                </Box>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt:2 }}>
                    <Paper sx={{ width: '50%', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
                        <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}`  }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main, mx: 2, fontWeight: 'bold' }}>
                                Thông tin sản phẩm tồn tại trong nhập kho
                            </Typography>
                        </Box>
                        <ReceiptImportManagementFormListProductItem productReceipt={receipt?.products as ReceiptProductData[]} specifications={specifications as Specification[]} receipt={receipt} render={fetchReceipt} materialId={id as string}/>
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