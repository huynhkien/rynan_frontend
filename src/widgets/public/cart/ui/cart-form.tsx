'use client'
import React, { useCallback, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  useTheme,
  Box,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Quantity } from '@/shared/components/ui/public/Quantity';
import { Button } from '@/shared/components';
import Image from 'next/image';

interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  package_unit: string;
  quantity: number;
}

const initialCart: CartItem[] = [
  { id: '1', image: '/banner/banner-5.jpg', name: 'Phân bón A', package_unit: '5 kg', price: 100000, quantity: 2 },
  { id: '2', image: '/banner/banner-5.jpg', name: 'Phân bón B', package_unit: '10 kg', price: 150000, quantity: 1 },
  { id: '3', image: '/banner/banner-5.jpg', name: 'Phân bón C', package_unit: '15 kg', price: 200000, quantity: 3 },
  { id: '4', image: '/banner/banner-5.jpg', name: 'Phân bón D', package_unit: '20 kg', price: 200000, quantity: 3 },
  { id: '5', image: '/banner/banner-5.jpg', name: 'Phân bón E', package_unit: '25 kg', price: 200000, quantity: 3 },
];

export const CartForm = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  // Xử lý thay đổi số lượng cho từng item
  const handleQuantityChange = useCallback((itemId: string, value: string) => {
    if (value === '') {
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: 1 } : item
        )
      );
      return;
    }
    
    const num = Number(value);
    if (!isNaN(num) && num >= 1 && num <= 999) {
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: num } : item
        )
      );
    }
  }, []);

  // Xử lý tăng/giảm số lượng cho từng item
  const handleChangeQuantity = useCallback((itemId: string, flag: string) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          if (flag === 'minus' && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else if (flag === 'plus' && item.quantity < 999) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      })
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold,
                  '&:first-of-type': {
                    borderTopLeftRadius: '8px'
                  }
                }}
              >
                Tên sản phẩm
              </TableCell>
              <TableCell 
                align='center'
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold
                }}
              >
                Hình ảnh
              </TableCell>
              <TableCell 
                align='right'
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold
                }}
              >
                Giá
              </TableCell>
              <TableCell 
                align='right'
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold
                }}
              >
                Đơn vị
              </TableCell>
              <TableCell 
                align='center'
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold
                }}
              >
                Số lượng
              </TableCell>
              <TableCell 
                align='right'
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold
                }}
              >
                Tổng
              </TableCell>
              <TableCell 
                align='center'
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightBold,
                  '&:last-of-type': {
                    borderTopRightRadius: '8px'
                  }
                }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 4 }}>
                  Giỏ hàng trống
                </TableCell>
              </TableRow>
            ) : (
              cartItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ verticalAlign: 'middle' }}>
                      {item.name}
                    </TableCell>
                    <TableCell align='center' sx={{ verticalAlign: 'middle' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: 'hidden',
                          mx: 'auto',
                          backgroundColor: 'grey.200'
                        }}
                      >
                        <Image
                          fill
                          src={item.image}
                          alt={item.name}
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align='right' sx={{ verticalAlign: 'middle' }}>
                      {item.price.toLocaleString('vi-VN')} VNĐ
                    </TableCell>
                    <TableCell align='right' sx={{ verticalAlign: 'middle' }}>
                      {item.package_unit}
                    </TableCell>
                    <TableCell align='center' sx={{ verticalAlign: 'middle' }}>
                      <Quantity
                        quantity={item.quantity}
                        handleChangeQuantity={(flag: string) => handleChangeQuantity(item.id, flag)}
                        handleQuantity={(value: string) => handleQuantityChange(item.id, value)}
                      />
                    </TableCell>
                    <TableCell align='right' sx={{ verticalAlign: 'middle' }}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </TableCell>
                    <TableCell align='center' sx={{ verticalAlign: 'middle' }}>
                      <IconButton 
                        onClick={() => handleDelete(item.id)} 
                        color='error'
                        aria-label={`Xóa ${item.name}`}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
            {cartItems.length > 0 && (
              <TableRow>
                <TableCell colSpan={5} align='right' sx={{ fontWeight: 'bold' }}>
                  Tổng cộng (Đã bao gồm VAT):
                </TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  {totalAmount.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  <Button name='Mua hàng'/>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={cartItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Số hàng mỗi trang:'
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  );
};