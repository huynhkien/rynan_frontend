'use client';

import React, { useCallback, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, IconButton, useTheme, Box
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Quantity } from '@/shared/components/ui/public/Quantity';
import { Button } from '@/shared/components';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { removeItemCart, updateQuantityCart } from '@/features/user/store/userSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Swal, { SweetAlertResult } from 'sweetalert2';

export const CartForm = () => {
  const { cart, current, isLogin } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // Xử lý giỏ hàng
  const handleDeleteCart = async(id: string) => {
    console.log(id);
    dispatch(removeItemCart({pid: id}));
    toast.success('Xóa sản phẩm khỏi giỏ hàng thành công')
  }
  const handleChangeQuantity = useCallback(({flag, quantity}: {flag?: string, quantity: number}) => {
          if (flag === 'minus' && quantity > 1) {
              return quantity - 1;
          } else if (flag === 'plus' && quantity < 999) {
              return quantity + 1;
          }else{
            return quantity;
          }
      }, []);

  const handleQuantity = (pid: string, num: number) => {
    if (num >= 1 && num <= 999) {
      dispatch(updateQuantityCart({ pid, quantity: num }));
    }
  };
  // Xử chuyển đến trang thanh toán
  const handleCheckOut = async() => {
    if(isLogin && current){
       router.push('/checkout');
    }else{
       return Swal.fire({
          text: 'Vui lòng đăng nhập',
          icon: 'info',
          cancelButtonText: 'Không phải bây giờ',
          showCancelButton: true,
          confirmButtonText: 'Chuyển đến trang đăng nhập'
       }).then((rs: SweetAlertResult) => {
          if(rs.isConfirmed) router.push('/login')
       });
    }
 }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                { label: 'Tên sản phẩm', align: 'left' },
                { label: 'Hình ảnh', align: 'center' },
                { label: 'Giá', align: 'right' },
                { label: 'Số lượng', align: 'center' },
                { label: 'Tổng', align: 'right' },
                { label: 'Hành động', align: 'center' },
              ].map((cell, index) => (
                <TableCell
                  key={cell.label}
                  align='center'
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.secondary,
                    fontWeight: theme.typography.fontWeightBold,
                    ...(index === 0 && { borderTopLeftRadius: '8px' }),
                    ...(index === 6 && { borderTopRightRadius: '8px' }),
                  }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {cart.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Giỏ hàng trống
                </TableCell>
              </TableRow>
            ) : (
              cart
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(item => (
                  <TableRow key={item.pid} hover>
                    <TableCell sx={{ verticalAlign: 'middle' }}>{item.name}</TableCell>

                    <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: 'hidden',
                          mx: 'auto',
                          backgroundColor: 'grey.200',
                        }}
                      >
                        <Image
                          fill
                          src={item.thumb || ''}
                          alt={item.name || ''}
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="right" sx={{ verticalAlign: 'middle' }}>
                      {(item.price || 0).toLocaleString()} VNĐ
                    </TableCell>

                    <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                      <Quantity
                        quantity={item.quantity}
                        handleChangeQuantity={(flag) => {
                          const newQuantity = handleChangeQuantity({ flag, quantity: item.quantity });
                          handleQuantity(item.pid || '', newQuantity);
                      }}
                      handleQuantity={(value) => {
                        const parsedValue = Number(value);
                        if (!isNaN(parsedValue)) {
                          handleQuantity(item.pid || '', parsedValue);
                        }
                      }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ verticalAlign: 'middle' }}>
                      {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </TableCell>

                    <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                      <IconButton onClick={() => handleDeleteCart(item.pid || '')} color="error" aria-label={`Xóa ${item.name}`}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}

            {cart.length > 0 && (
              <TableRow>
                <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                  Tổng cộng (Đã bao gồm VAT):
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {totalAmount.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Button handleOnClick={handleCheckOut} name="Mua hàng" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cart.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  );
};
