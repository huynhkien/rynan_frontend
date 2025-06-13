'use client'
import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import Image from 'next/image';

const HomeBanner = () => {
  const theme = useTheme();
  return (
    <Box sx={{position: 'relative'}}>
      <Box
          sx={{
              position: 'absolute',
              top: -30,
              width: '100%',
              zIndex: 5,
          }}
      >
          <Image
              src='/shape/page-title-top.png'
              alt='page-title-top'
              width={0}
              height={0}
              sizes="110vw"
              style={{
                  width: '100%',
                  height: '50px',
                  objectFit: 'cover'
              }}
          />
      </Box>
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
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
            backgroundImage: 'url(/banner/banner-5.jpg)',
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
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                mb: 3,
              }}
            >
              Nông nghiệp
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                mb: 2,
              }}
            >
              Giải pháp bền vững và thiết thực nhất cho cuộc sống
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeBanner;