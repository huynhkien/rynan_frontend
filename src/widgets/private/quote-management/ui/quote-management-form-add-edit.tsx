'use client'

import { getAllProduct } from "@/features/product/api/productApi";
import { Product } from "@/features/product/type/productType";
import { getAllUser, getUserById} from "@/features/user/api/userApis";
import { addProductToQuote, removeAllQuoteProduct } from "@/features/user/store/userSlice";
import { UserData, UserDataProps } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppHook";
import { Box, Paper, Typography, useTheme, Button} from "@mui/material"
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState} from "react";
import { useForm} from "react-hook-form";
import { QuoteManagementFormProductList } from "./quote-management-form-proudct-list";
import { createQuote, getAllQuote, getQuoteById, updateQuote } from "@/features/quote/api/quoteApi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { QuoteData, QuoteProductData } from "@/features/quote/type/quoteType";
import { QuoteManagementFormUserList } from "./quote-management-form-user-list";
import { showModal } from "@/shared/store/appSlice";

export const QuoteManagementFormAddEdit = () => {
    const {control} = useForm<UserDataProps>();
    const theme = useTheme();
    const {quoteProduct} = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    // Lấy id khi có cập nhật thông tin
    const {id} = useParams();
    // State cho sản phẩm
    const [products, setProducts] = useState<Product[] | []>([]);
    // State cho báo giá
    const [quotes, setQuotes] = useState<QuoteData[]>();
    const [quotation, setQuotation] = useState<string>();
    const [quoteProducts, setQuoteProducts] = useState<Product[] | []>([]);
    // State khi lựa chọn thông tin khách hàng
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [user, setUser] = useState<UserData>();
    // State cho sản phẩm đã được filter
    const [filteredProducts, setFilteredProducts] = useState<Product[] | []>([]);
    // Hiển thị thông tin báo giá
    useEffect(() => {
        const fetchQuotes = async() => {
            const response = await getAllQuote();
            if(response.success) setQuotes(response.data)
        }
        fetchQuotes();
    }, []);
    // Hiển thị thông tin khách hàng
    useEffect(() => {
        if(!selectedUser) return;
        const fetchUser = async () => {
            const response = await getUserById(selectedUser as string);
            if(response.success) setUser(response.data)
        }
    fetchUser();
    },[selectedUser]);
    
    // Hiển thị thông tin sản phẩm
    const fetchProducts = async() => {
        const response = await getAllProduct();
        if(response.success) setProducts(response.data || []);
    }
    useEffect(() => {
        fetchProducts();
    }, []);
    
    //  State cho khách hàng
    const [users, setUsers] = useState<UserData[] | []>([]);

    // Xử lý thông tin nhân viên
    const fetchUser = async () => {
            const response = await getAllUser();
            if (response.success) {
                const filteredUsers = response.data.filter((el) =>
                ['2000'].includes(el.role || ''));
                setUsers(filteredUsers || []);
            }
    }
    useEffect(() => {
        fetchUser();
    },[]);
    // Hiển thị thông tin chi tiết phiếu báo giá
    useEffect(() => {
        if (!id) return;

        const fetchQuote = async () => {
            const response = await getQuoteById(id as string);
            if (response.success && response.data?.products) {
                console.log(response.data.products);
                const quoteProductIds = response.data.products.map((item) => item.pid);
                console.log(quoteProductIds);
                const filtered = products.filter((el) => quoteProductIds.includes(el._id));

                setQuoteProducts(filtered);
                setSelectedUser(response.data.client as string);
                setQuotation(response.data.quotation);
            }
        };

        fetchQuote();
    }, [id, products]);

    // Xử lý lựa chọn sản phẩm
    const handleSelectionChangeProduct = (value: string | number) => {
        if(id){
            const existingProduct = quoteProducts.find((el) => el._id === value);
            if(existingProduct){
                alert('Sản phẩm hiện đã có trong dữ liệu. Vui lòng thêm sản phẩm khác')
            }else{
                dispatch(addProductToQuote({pid: value}));
            }
        }else{
            dispatch(addProductToQuote({pid: value}));
        }
    }
    // Xử lý lựa chọn khách hàng
    const handleSelectionChangeUser = (id: string | number) => {
        setSelectedUser(id as string)
    }
    
    // Tìm kiếm sản phẩm xuất hiện trong quoteProduct state
    useEffect(() => {
        const fetchProductToQuote = () => {
            const filtered = products.filter((el) => {
                return quoteProduct.some((item) => item.pid === el._id);
            });
            setFilteredProducts(filtered);
        }
        fetchProductToQuote();
    }, [products, quoteProduct]);
    // Hàm tạo mã số báo giá tự động
    const generateUniqueCode = useCallback(() => {
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2); // Lấy 2 số cuối của năm
        // Tìm số thứ tự cao nhất từ các đơn hàng hiện có
        const currentYearQuotes = quotes?.filter(quote => 
          quote.quotation && quote.quotation.startsWith(`RYNANQ${yearSuffix}-`)
        );
        let maxNumber = 0;
        currentYearQuotes?.forEach(quote => {
          const match = (quote?.quotation as string).match(/RYNANQ\d{2}-0*(\d+)$/);
          if (match) {
            const number = parseInt(match[1]);
            if (number > maxNumber) {
              maxNumber = number;
            }
          }
        });
        // Tạo mã mới với số thứ tự tiếp theo
        const nextNumber = maxNumber + 1;
        const paddedNumber = nextNumber.toString().padStart(3, '0'); // Pad với 4 chữ số
        return `RYNANQ${yearSuffix}-${paddedNumber}`;
      }, [quotes]);
    // Kiểm tra mã báo giá đã tồn tại trong hệ thống chưa
    // Tạo phiếu báo giá 
    const handleCreateQuote = async() => {
        try{
            if (!selectedUser) {
            Swal.fire(
                'Thiếu thông tin!',
                'Vui lòng chọn thông tin người dùng để tạo phiếu báo giá.',
                'warning'
            );
            return;
            }
            if (quoteProduct.length < 0) {
                Swal.fire(
                    'Thiếu thông tin!',
                    'Vui lòng chọn sản phẩm để tạo phiếu báo giá.',
                    'warning'
                );
                return;
            }
            const newQuoteData = {
                client: selectedUser as string,
                products: quoteProduct as QuoteProductData[],
                quotation: generateUniqueCode(),
            }
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            const response = await createQuote(newQuoteData);
            if(response.success) {
                dispatch(showModal({ isShowModal: false, modalType: null }));
                toast.success(response.message)
                setSelectedUser(null);
                dispatch(removeAllQuoteProduct())
            }
        }catch(error: unknown){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }
    // Cập nhật phiếu báo giá 
    const handleUpdateQuote = async() => {
        try{
            if (!selectedUser) {
            Swal.fire(
                'Thiếu thông tin!',
                'Vui lòng chọn thông tin người dùng để tạo phiếu báo giá.',
                'warning'
            );
            return;
            }
            if (quoteProduct.length < 0) {
                Swal.fire(
                    'Thiếu thông tin!',
                    'Vui lòng chọn sản phẩm để tạo phiếu báo giá.',
                    'warning'
                );
                return;
            }
            const quoteProductsId = quoteProducts.map((el) => ({pid: el._id}));
            const combinedProducts = [...quoteProductsId, ...quoteProduct];
            const newQuoteData = {
                client: selectedUser as string,
                products: combinedProducts as QuoteProductData[],
                quotation: quotation
            }
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            const response = await updateQuote(newQuoteData, id as string);
            if(response.success) {
                dispatch(showModal({ isShowModal: false, modalType: null }));
                toast.success(response.message)
                setSelectedUser(null);
                dispatch(removeAllQuoteProduct())
            }
        }catch(error: unknown){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }
    return (
        <>
        <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
            <Box sx={{ py: 2 }}>
                <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>
                    {id ? 'Cập nhật thông tin báo giá' : 'Thêm thông tin báo giá'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 5 }}>
                <Box sx={{ width: '65%' }}>
                    <Box sx={{ py: 2 }}>
                        <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                            Thông tin sản phẩm
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/* Lựa chọn sản phẩm */}
                        <Box>
                            <ControlledSelect
                                label='Lựa chọn sản phẩm'
                                important
                                sx={{ width: '100%' }}
                                name='type'
                                onSelectionChange={handleSelectionChangeProduct}
                                control={control}
                                options={products.map((item) => ({
                                    _id: item._id,
                                    name: item.name_vn
                                }))}
                                rules={{ required: 'Vui lòng chọn sản phẩm' }}
                                searchable={true}
                            />
                        </Box>
                            <QuoteManagementFormProductList product={filteredProducts} render={fetchProducts}/>
                            {id && (
                                <QuoteManagementFormProductList product={quoteProducts} render={fetchProducts} id={id as string}/>
                            )}
                    </Box>
                </Box>
                <Box sx={{ width: '35%'}}>
                    <Box sx={{ py: 2 }}>
                        <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                            Thông tin khách hàng
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <ControlledSelect
                            label='Lựa chọn thông tin khách hàng'
                            important
                            name='staff'
                            control={control}
                            onSelectionChange={handleSelectionChangeUser}
                            options={users}
                            rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                            searchable={true}
                        />
                    </Box>
                    <Box sx={{mt: 2}}>
                        <QuoteManagementFormUserList user={user as UserData}/>
                    </Box>
                </Box>
            </Box>
            {/* Submit buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" onClick={id ? handleUpdateQuote : handleCreateQuote}>
                    {id ? 'Cập nhật phiếu báo giá' : 'Tạo phiếu báo giá'}
                </Button>
            </Box>
        </Paper>
        </>
    );
};