'use client'
import { Card, CardContent, Typography, Box, IconButton, Chip, useTheme } from '@mui/material';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';

const ProductCard = () => {
  const theme = useTheme();
  const [hovering, setHovering] = useState(false);

  return (
    <Card
      sx={{ 
        width: {xs: '40%', md: '250px'}, 
        height: {xs: '310px', md: '400px'}, 
        borderRadius: '12px', 
        boxShadow: hovering ? 6 : 6,
        transition: 'all 0.3s ease',
        transform: hovering ? 'translateY(-5px)' : 'translateY(0)',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'relative', width: '100%', height: 'auto', aspectRatio: '5/4' ,
            transition: 'transform 0.3s ease',
            transform: hovering ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <Image
            fill
            src='/product/NPK 22-10-10+TE_800x600_XcD0ucElDl.png'
            alt='VETAMATE 210'/>
        </Box>
        {/* Giá */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: 2,
            backdropFilter: 'blur(10px)',
            fontSize: {xs: '12px', md: '14px'},
            color: theme.palette.primary.main 
          }}
        >
          100.000 VNĐ
        </Box>

        {/* Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: hovering ? 12 : -60,
            display: 'flex',
            flexDirection: 'column',
            opacity: hovering ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: hovering ? '0.1s' : '0s'
          }}
        >
          <IconButton 
            component='a' 
            href='/' 
            sx={{ 
              boxShadow: 5,
              '&:hover': { 
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <FavoriteIcon sx={{ color: theme.palette.primary.light, fontSize: theme.typography.fontSize }} />
          </IconButton>
          
          <IconButton 
            component='a' 
            href='/' 
            sx={{ 
              boxShadow: 5,
              '&:hover': { 
                backgroundColor: 'white',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
              transitionDelay: '0.05s'
            }}
          >
            <VisibilityIcon sx={{ color: theme.palette.primary.light,  fontSize: theme.typography.fontSize }} />
          </IconButton>
          <IconButton 
            component='a' 
            href='/' 
            sx={{ 
              boxShadow: 5,
              '&:hover': { 
                backgroundColor: 'white',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
              transitionDelay: '0.05s'
            }}
          >
            <ShoppingCartIcon sx={{ color: theme.palette.primary.light,  fontSize: theme.typography.fontSize }} />
          </IconButton>
        </Box>

        {/* Giảm giá(nếu có) */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#ff5722',
            color: theme.palette.text.secondary,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: {xs: '12px' , md: theme.typography.body1.fontSize},
            fontWeight: theme.typography.fontWeightBold
          }}
        >
          -20%
        </Box>
      </Box>
      {/* Thông tin */}
      <CardContent sx={{ p:1, height: '200px', display: 'flex', flexDirection: 'column' }}>
        <Typography 
          sx={{
            fontSize: {xs: '14px' , md: theme.typography.body1.fontSize},
          }}
        >
          RYNAN® FLOWERMATE 210 - Hũ 150g
        </Typography>
        
        <Typography 
          sx={{
            fontSize: {xs: '12px' , md: theme.typography.body1.fontSize},
          }}
        >
          Phân bón dùng cho lan hồ điệp giai đoạn phân hóa mầm
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt:1 }}>
          <Chip 
            label='913 đã bán' 
            size='small' 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.secondary,
              fontSize: {xs: `calc(${theme.typography.body1.fontSize} - 4px)`, md: `calc(${theme.typography.body1.fontSize} - 2px)`}
            }}
          />
        </Box>

        {/* Đánh giá */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 ,
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box
                key={star}
                sx={{
                  color: theme.palette.warning.main
                }}
              >
                ★
              </Box>
            ))}
          </Box>
          <Typography variant='body1'>
            (5.0)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;