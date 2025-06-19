'use client'
import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Typography, useTheme, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import { CartDrawerProps } from '@/types/widgets/cart-drawer';
import { Button } from '@/shared/components';
import { useRouter } from 'next/navigation';

export const CartDrawerView = ({open, setOpen} : CartDrawerProps) => {
    const theme = useTheme();
    const router = useRouter();
    const orders = [
    {
      id: 1,
      image: '/banner/banner-5.jpg',
      name: 'Phân bón A',
      quantity: 1,
      price: 100000,
      total: 100000
    },
    {
      id: 2,
      image: '/banner/banner-5.jpg',
      name: 'Phân bón B',
      quantity: 1,
      price: 100000,
      total: 100000
    },
    {
      id: 3, 
      image: '/banner/banner-5.jpg',
      name: 'Phân bón C',
      quantity: 1,
      price: 100000,
      total: 100000
    },
    {
      id: 4,
      image: '/banner/banner-5.jpg',
      name: 'Phân bón D',
      quantity: 1,
      price: 100000,
      total: 100000
    },
    {
      id: 5,
      image: '/banner/banner-5.jpg',
      name: 'Phân bón E',
      quantity: 1,
      price: 100000,
      total: 100000
    },
    {
      id: 6, 
      image: '/banner/banner-5.jpg',
      name: 'Phân bón F',
      quantity: 1,
      price: 100000,
      total: 100000
    }
  ];

    const handleClose = () => {
        setOpen(false);
    };
    const handleCheckOut = () => {
      router.push('/checkout')
    }
    const handleCart = () => {
      router.push('/cart')
    }

    const DrawerList = (
        <Box sx={{ width: 450, height: '100%' }} role='presentation' position='relative'>
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
              {orders.map((order, index) => (
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
                        src={order.image}
                        alt={order.name}
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{display: 'flex', gap: 1}}>
                        <Typography
                        variant='body1'
                        sx={{
                          fontWeight: theme.typography.fontWeightMedium,
                          mb: 0.5
                        }}
                        >
                        {order.name}
                        </Typography>
                        <Typography
                        variant='body1'
                        sx={{
                          mb: 0.5
                        }}
                        >
                        x {order.quantity}
                        </Typography>
                      </Box>
                      <Typography
                        variant='body1'
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {order.quantity} x {order.price.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant='body1'
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                      color: theme.palette.primary.main
                    }}
                  >
                    {order.total.toLocaleString()} VNĐ
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
                        {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} VNĐ
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
                    width: 450,
                    height: '100%'
                }
            }}
        >
            {DrawerList}
        </Drawer>
    );
}
