'use client'
import { Box, Card, CardContent, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';



export const ProductFilterCategory = () => {
    const category = [
    'Phân bón dành cho cây cam',
    'Phân dùng cho cây cà phế, tiêu, lương thực',
    'Phân bón dùng cho lan hồ điệp giai đoạn cây con ',
    'Phân bón dùng cho hoa hồng trước khi ra hoa',
    ];
  const theme = useTheme();
  return (
    <Card sx={{
      border: `1px solid ${theme.palette.primary.dark}`,
      borderRadius: '10px'
    }}>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          p:2,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant='body2' sx={{fontWeight: theme.typography.fontWeightBold}}>Lọc theo danh mục</Typography>
      </Box>
      <CardContent sx={{ p: 3, cursor: 'pointer' }}>
        <Stack spacing={3}>
          {category.map((el, index) => (
            <Typography key={index} sx={{
            '&:hover': {
                color:  theme.palette.warning.main,
                transform: 'translateX(5px)',
                },
                transition: 'all 0.3s ease',
            }}>
            {el} (1)
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
