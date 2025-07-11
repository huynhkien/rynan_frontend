'use client'
import { Product } from '@/features/product/type/productType';
import { Box, Card, Chip, Typography, useTheme } from '@mui/material';
import React from 'react';

export const ProductFilterTag = ({
  products, 
  handleSelectValue,
  selectedTag
}: {
  products: Product[], 
  handleSelectValue: (id: string) => void,
  selectedTag: string
}) => {
  const theme = useTheme();
  
    // Gộp tất cả các tag
    const allTag = products.flatMap(el => el.tags);
     // Lọc các tag không trùng nhau
    const tags = Array.from(new Set(allTag.map(el => el.tag)));
    //   

return (
    <Card sx={{
      border: `1px solid ${theme.palette.primary.dark}`,
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          p: 2,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography 
          variant='body2' 
          sx={{ fontWeight: theme.typography.fontWeightBold }}
        >
          Lọc theo tag
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        height: '280px',
        overflow: 'hidden',
      }}>
        <Box 
          sx={{
            height: '100%',
            overflowY: 'auto', 
            overflowX: 'hidden',
            paddingRight: '8px',
            marginRight: '-8px', 
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
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1, 
            alignContent: 'flex-start', 
            alignItems: 'flex-start', 
          }}
        >
          {tags.map((tag) => (
            <Chip
              onClick={() => handleSelectValue(tag)}
              key={tag}
              label={tag}
              size='small'
              variant='outlined'
              sx={{
                minWidth: 'auto',
                maxWidth: '100px',
                height: '28px', // Fixed height
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 2px 4px ${theme.palette.primary.main}33`,
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '& .MuiChip-label': {
                  fontSize: '0.75rem',
                  padding: '0 8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                backgroundColor: `${selectedTag === tag ? theme.palette.primary.main : theme.palette.text.secondary}`,
                color: `${selectedTag === tag ? theme.palette.text.secondary : theme.palette.text.primary}`
              }}
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
};