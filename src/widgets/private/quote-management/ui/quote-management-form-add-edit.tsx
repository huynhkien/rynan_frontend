'use client'

import { getAllProduct } from "@/features/product/api/productApi";
import { Product } from "@/features/product/type/productType";
import { getAllUser} from "@/features/user/api/userApis";
import { addProductToQuote } from "@/features/user/store/userSlice";
import { UserData, UserDataProps } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppHook";
import { Box, Paper, Typography, useTheme, Button} from "@mui/material"
import { useParams } from "next/navigation";
import { useEffect, useState} from "react";
import { useForm} from "react-hook-form";
import { QuoteManagementFormProductList } from "./quote-management-form-proudct-list";

export const QuoteManagementFormAddEdit = () => {
    const {control} = useForm<UserDataProps>();
    const theme = useTheme();
    const {quoteProduct} = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [isEditProduct, setIsEditProduct] = useState<boolean>(false);
    // Lấy id khi có cập nhật thông tin
    const {id} = useParams();
    // State cho sản phẩm
    const [products, setProducts] = useState<Product[] | []>([]);
    // State cho sản phẩm đã được filter
    const [filteredProducts, setFilteredProducts] = useState<Product[] | []>([]);
    
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
    
    // Xử lý lựa chọn sản phẩm
    const handleSelectionChange = (value: string | number) => {
        dispatch(addProductToQuote({pid: value}));
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
    return (
        <>
        <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.default }}>
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
                                onSelectionChange={handleSelectionChange}
                                control={control}
                                options={products.map((item) => ({
                                    _id: item._id,
                                    name: item.name_vn
                                }))}
                                rules={{ required: 'Vui lòng chọn sản phẩm' }}
                                searchable={true}
                            />
                        </Box>
                        {filteredProducts.length > 0 && (
                            <QuoteManagementFormProductList product={filteredProducts} render={fetchProducts} setIsEditProduct={setIsEditProduct} isEditProduct={isEditProduct}/>
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
                            options={users}
                            rules={{ required: 'Vui lòng chọn thông tin khách hàng' }}
                            searchable={true}
                        />
                    </Box>
                </Box>
            </Box>
            {/* Submit buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained">
                    Tạo phiếu báo giá
                </Button>
            </Box>
        </Paper>
        </>
    );
};