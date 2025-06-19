'use client'

import { Button } from '@/shared/components'
import { Box, Typography, useTheme } from '@mui/material'
import Image from 'next/image'

export const CheckoutSummary = () => {
  const theme = useTheme()
  
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
  ]

  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: '59px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopRightRadius: '5px',
          borderTopLeftRadius: '5px'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: theme.typography.fontWeightBold
          }}
        >
          Hóa Đơn
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: theme.palette.background.paper,  }}>
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
                  width: 'calc(100% - 16px)',
                  left: '8px'
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
                    mx: 'auto'
                  }}
                >
                  <Image
                    fill
                    src={order.image}
                    alt={order.name}
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: theme.typography.fontWeightMedium,
                    mx: 1
                  }}
                >
                  {order.name}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    mx: 3
                  }}
                >
                  {order.quantity} x {order.price.toLocaleString()} VNĐ
                </Typography>
              </Box>
              <Typography
                variant="body1"
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
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 2,
          borderTop: `1px solid ${theme.palette.grey[400]}`
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: theme.typography.fontWeightBold }}
        >
          Tổng:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.primary.main
          }}
        >
          {totalAmount.toLocaleString()} VNĐ
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 2,
          borderTop: `1px solid ${theme.palette.grey[400]}`
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: theme.typography.fontWeightBold }}
        >
          Hình thức thanh toán:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.primary.main
          }}
        >
          Tiền mặt 
        </Typography>
      </Box>
      <Box>
        <Button
            name='Thanh Toán'
        />
      </Box>
    </Box>
  )
}