'use client';
import { OrderData } from '@/features/order/type/orderType';
import { Product } from '@/features/product/type/productType';
import { ReceiptData } from '@/features/receipt/type/receiptType';
import { UserData } from '@/features/user/type/userTypes';
import { Box, Paper, Typography, useTheme } from '@mui/material';

export const AdminManagementStatisticalInfo = ({users, products, orders, receipts} : {users: UserData[], products: Product[], orders: OrderData[], receipts: ReceiptData[]}) => {
    const theme = useTheme();
    const total = receipts.filter(el => el.typeReceipt === 'export').reduce((sum, item) => sum + item.total, 0) + orders.reduce ((sum, item) => sum + item.total, 0)
    const statisticalData = [
        { label: 'Tổng doanh thu', value: `${total.toLocaleString() || 0} VNĐ` },
        { label: 'Tổng đơn hàng', value: orders.length || 0 },
        { label: 'Tổng phiếu xuất/nhập', value: receipts.length || 0 },
        { label: 'Khách hàng', value: users.length || 0 },
        { label: 'Tổng sản phẩm', value: products.length || 0 },
    ];
return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 3,
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        {statisticalData.map((item, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              width: { xs: '100%', sm: '48%', md: '17%' },
              p: 3,
              borderRadius: 0,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
              background: theme.palette.primary.main,
            }}
          >
            <Typography
              variant='body1'
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {item.label}
            </Typography>
            <Typography
              variant='h6'
              component='div'
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>
  );
};