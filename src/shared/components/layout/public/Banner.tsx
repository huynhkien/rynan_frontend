'use client'
import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import Image from 'next/image';
import { BannerProps } from '@/types/components/banner.types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
export const Banner = ({category, breadcrumb}: BannerProps) => {
  const theme = useTheme();
  return (
    <Box sx={{position: 'relative'}}>
      <Box
        sx={{
          position: 'relative',
          height: '50vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/banner/banner-9.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', 
            zIndex: -2,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        />
        <Container maxWidth='lg'>
          <Box
            sx={{
              textAlign: 'start',
              color: theme.palette.text.secondary,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography
              variant='h5'
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                mb: 3,
              }}
            >
              {category}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant='body2' component='a' href='/' sx={{ textDecoration: 'none', color: theme.palette.text.secondary }}>Trang chủ</Typography>
              {breadcrumb.map((el, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArrowForwardIosIcon fontSize='small' sx={{ mt: 1, fontSize: theme.typography.fontSize }} />
                  <Typography
                    variant='body2'
                    component='a'
                    href={el?.url}
                    sx={{ textDecoration: 'none', color: theme.palette.text.secondary }}
                  >
                    {el?.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -5,
                    width: '100%',
                    zIndex: 5,
                }}
            >
          <Image
              src='/shape/grass.png'
              alt='page-title-top'
              width={0}
              height={0}
              sizes='110vw'
              style={{
                  width: '100%',
                  height: '55px',
                  objectFit: 'cover'
              }}
          />
      </Box>
    </Box>
  );
};
