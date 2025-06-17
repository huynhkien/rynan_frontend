'use client'
import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Stack,
  Button,
  useTheme,
} from '@mui/material';
import { PriceFilterProps, PriceRange } from '@/types/widgets/productFilterPrice';


export const ProductFilterPrice: React.FC<PriceFilterProps> = ({
  initialMin = 0,
  initialMax = 637,
  minRange = 0,
  maxRange = 100000000,
  onFilter,
  currency = 'VNĐ',
}) => {
  const theme = useTheme();
  const [priceRange, setPriceRange] = useState<number[]>([initialMin, initialMax]);


  const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);
    }
  }, []);

  const handleFilter = useCallback(() => {
    const newRange: PriceRange = {
      min: priceRange[0],
      max: priceRange[1],
    };
    
    if (onFilter) {
      onFilter(newRange);
    }
    
    console.log(`Filtering by price: ${currency}${newRange.min} - ${currency}${newRange.max}`);
  }, [priceRange, onFilter, currency]);

  const formatPrice = (value: number): string => {
    return `${value.toLocaleString()} ${currency}`;
  };

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
        <Typography variant='body2' sx={{fontWeight: theme.typography.fontWeightBold}}>Lọc theo giá</Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ px: 1 }}>
            <Slider
              sx={{
                color: theme.palette.primary.main,
                height: 8,
                '& .MuiSlider-track': {
                  border: 'none',
                  backgroundColor: theme.palette.primary.main,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: theme.palette.primary.light,
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  height: 16,
                  width: 16,
                  backgroundColor: theme.palette.primary.main,
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
                  },
                },
              }}  
              value={priceRange}
              onChange={handleSliderChange}
              valueLabelDisplay='auto'
              valueLabelFormat={formatPrice}
              min={minRange}
              max={maxRange}
              disableSwap
              aria-labelledby='price-range-slider'
            />
          </Box>
          <Stack 
            direction='row' 
            justifyContent='space-between' 
            alignItems='center'
            sx={{ mt: 2 }}
          >
            <Box color='text.secondary'>
              <Typography 
                component='span' 
                variant='body1' 
                color='text.primary'
              >
                {formatPrice(priceRange[0])}
              </Typography>
              <Typography 
                component='span' 
                variant='body1' 
                color='text.disabled'
                sx={{ mx: 1 }}
              >
                —
              </Typography>
              <Typography 
                component='span' 
                variant='body1' 
                color='text.primary'
              >
                {formatPrice(priceRange[1])}
              </Typography>
            </Box>

            <Button onClick={handleFilter} sx={{backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary}}>
              Lọc
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
