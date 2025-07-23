'use client'
import { Category} from '@/features/category/type/categoryType';
import { Product } from '@/features/product/type/productType';
import { Box, Card, CardContent, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

export const ProductFilterCategory = ({categories, products, handleSelectValue, selectedCategory} : {categories: Category[], products: Product[], handleSelectValue: (id: string) => void, selectedCategory: string}) => {
  const theme = useTheme();
  
  return (
    <Card sx={{
      border: `1px solid ${theme.palette.primary.dark}`,
      borderRadius: '10px'
    }}>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          p: 2,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant='body2' sx={{fontWeight: theme.typography.fontWeightBold}}>
          Lọc theo danh mục
        </Typography>
      </Box>
      
      <CardContent sx={{ 
        p: 3, 
        cursor: 'pointer', 
        height: '280px',
        overflow: 'hidden' 
      }}>
        <Stack 
          spacing={3}
          sx={{
            height: '100%',
            overflowY: 'auto', 
            overflowX: 'hidden',
            paddingRight: '1px', 
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[100],
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.primary.main,
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          {categories.map((el) => (
            <Box 
              key={el._id}
              onClick={() => handleSelectValue(el._id)}
              sx={{
                flexShrink: 0, 
                backgroundColor: `${selectedCategory === el._id ? theme.palette.primary.main : ''}`
              }}
            >
              <Typography sx={{
                color: `${selectedCategory === el._id ? theme.palette.text.secondary : theme.palette.text.primary}`,
                '&:hover': {
                  color: theme.palette.warning.main,
                  transform: 'translateX(5px)',
                },
                transition: 'all 0.3s ease',
              }}>
                {el.name} ({products.filter(p => p.category === el._id).length})
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};