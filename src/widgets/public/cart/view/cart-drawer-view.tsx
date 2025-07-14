'use client'
import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Typography, useTheme, IconButton } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import Image from 'next/image';
import { CartDrawerProps } from '@/types/widgets/cart';
import { Button } from '@/shared/components';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { removeItemCart } from '@/features/user/store/userSlice';
import { toast } from 'react-toastify';
import Swal, { SweetAlertResult } from 'sweetalert2';

export const CartDrawerView = ({open, setOpen} : CartDrawerProps) => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {cart} = useAppSelector((state) => state.user);
    const handleClose = () => {
        setOpen(false);
    };
    const handleCheckOut = () => {
      return Swal.fire({
                text: 'Vui lòng đăng nhập',
                icon: 'info',
                cancelButtonText: 'Không phải bây giờ',
                showCancelButton: true,
                confirmButtonText: 'Chuyển đến trang đăng nhập'
             }).then((rs: SweetAlertResult) => {
                if(rs.isConfirmed) router.push('/login')
             })
    }
    const handleCart = () => {
      router.push('/cart')
    }
    // Xóa sản phẩm trong giỏ hàng
    const handleDeleteCart = async(id: string) => {
      dispatch(removeItemCart({
        pid: id
      }))
      toast.success('Xóa thành công sản phẩm khỏi giỏ hàng')
    }

    const DrawerList = (
        <Box sx={{ width: 500, height: '100%', backgroundColor: theme.palette.text.secondary }} role='presentation' position='relative'>
            {/* Header với nút đóng */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                    Giỏ hàng
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            {/* Danh sách sản phẩm */}
            <Box
              sx={{
                height: '335px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: '3px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[400],
                  borderRadius: '3px',
                  '&:hover': {
                    backgroundColor: theme.palette.grey[600]
                  }
                }
              }}
            >
              {cart.map((item, index) => (
                <Box
                  key={index} 
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    py: 1.5,
                    position: 'relative',
                    '&:not(:last-child)::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      width: 'calc(100% - 16px)',
                      left: '8px',
                      height: '1px',
                      backgroundColor: theme.palette.divider
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        mr: 2
                      }}
                    >
                      <Image
                        fill
                        src={item.thumb || ''}
                        alt={item.name || ''}
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{display: 'flex', gap: 1}}>
                        <Typography
                        variant='body1'
                        sx={{
                          fontWeight: theme.typography.fontWeightMedium,
                          mb: 0.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px'
                        }}
                        >
                        {item.name}
                        </Typography>
                        <Typography
                        variant='body1'
                        sx={{
                          mb: 0.5
                        }}
                        >
                        x {item.quantity}
                        </Typography>
                      </Box>
                      <Typography
                        variant='body1'
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {item.quantity} x {(item.price || 0).toLocaleString()} VNĐ
                      </Typography>
                      <Box>
                        <IconButton onClick={() => handleDeleteCart(item.pid || '')}>
                          <Delete color='error'/>
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant='body1'
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                      color: theme.palette.primary.main
                    }}
                  >
                    {((item.price || 0) * item.quantity).toLocaleString()} VNĐ
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ 
                p: 2, 
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                        Tổng cộng:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        fontWeight: theme.typography.fontWeightBold,
                        color: theme.palette.primary.main 
                    }}>
                        {cart.reduce((sum, cart) => sum + ((cart.price || 0)*cart.quantity), 0).toLocaleString()} VNĐ
                    </Typography>
                </Box>
                
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                px:2,
                position: 'absolute',
                bottom: 0,
                width: '100%',
                pb: 2
              }}
            >
            <Button
                name='Thanh Toán'
                handleOnClick={handleCheckOut}
              />
              <Button
                name='Xem chi tiết'
                handleOnClick={handleCart}
              />
            </Box>
        </Box>
    );

    return (
        <Drawer 
            anchor='right' 
            open={open} 
            onClose={handleClose}
            sx={{
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 500,
                    height: '100%'
                },
                
            }}
        >
            {DrawerList}
        </Drawer>
    );
}
