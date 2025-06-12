'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box, Button, Typography, useTheme } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

interface SlideContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

const images: string[] = [
  '/banner/banner-1.jpg', 
  '/banner/banner-2.jpg', 
  '/banner/banner-3.jpg'
];

const slideContents: SlideContent[] = [
  {
    title: 'Chuyên Cung Cấp Các Dòng Sản Phẩm Chất Lượng',
    subtitle: 'Vì mục tiêu cung cấp các sản phẩm nông nghiệp giá rẻ phục vụ cho bà con nông dân',
    buttonText: 'Liên hệ',
  },
  {
    title: 'Chuyên Cung Cấp Các Dòng Sản Phẩm Chất Lượng',
    subtitle: 'Vì mục tiêu cung cấp các sản phẩm nông nghiệp giá rẻ phục vụ cho bà con nông dân',
    buttonText: 'Liên hệ',
  },
  {
    title: 'Chuyên Cung Cấp Các Dòng Sản Phẩm Chất Lượng',
    subtitle: 'Vì mục tiêu cung cấp các sản phẩm nông nghiệp giá rẻ phục vụ cho bà con nông dân',
    buttonText: 'Liên hệ',
  },
];

export const HomeSlides: React.FC = () => {
    const theme = useTheme();
  return (
    <Box sx={{ 
      width: '100%', 
      height: '700px', 
      overflow: 'hidden', 
      position: 'relative',
      '@keyframes zoomIn': {
            from: { transform: 'scale(1)' },
            to: { transform: 'scale(1.05)' },
        },
        '& .swiper-slide-active .zoom-image': {
            animation: 'zoomIn 10s ease-in-out forwards',
        },
      '& .swiper-button-next, & .swiper-button-prev': {
        color: 'white !important',
        width: '50px !important',
        height: '50px !important',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '100%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.3s ease',
        '&::after': {
          fontSize: '18px !important',
          fontWeight: 'bold',
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.6)',
          transform: 'scale(1.1)',
        },
      },
      '& .swiper-button-prev': {
        left: '50px !important',
      },
      '& .swiper-button-next': {
        right: '50px !important',
      },
      '& .swiper-pagination-bullet': {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        opacity: 1,
      },
      '& .swiper-pagination-bullet-active': {
        backgroundColor: 'white',
      },
      '@keyframes slideUpIn': {
        '0%': {
          transform: 'translateY(100px)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      },
      '@keyframes slideRightIn': {
        '0%': {
          transform: 'translateX(-100px)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateX(0)',
          opacity: 1,
        },
      },
      '@keyframes slideDownIn': {
        '0%': {
          transform: 'translateY(-50px)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      },
      '& .swiper-slide-active .slide-title': {
        animation: 'slideUpIn 0.8s ease-out forwards',
        animationDelay: '0.2s',
      },
      '& .swiper-slide-active .slide-subtitle': {
        animation: 'slideRightIn 0.8s ease-out forwards',
        animationDelay: '0.4s',
      },
      '& .swiper-slide-active .slide-button': {
        animation: 'slideDownIn 0.8s ease-out forwards',
        animationDelay: '0.6s',
      },
    }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={0}
        slidesPerView={1}
        style={{ height: '100%' }} 
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Box
              className='zoom-image'
              sx={{
                width: '100%',
                height: '700px', 
                overflow: 'hidden', 
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
            </Box>
            <Box
                sx={{
                  position: 'absolute',
                  top: '20%',
                  textAlign: 'start',
                  marginLeft: 20,
                  color: 'white',
                  width: '80%',
                  maxWidth: '700px',
                  zIndex: 2,
                  px: { xs: 2, md: 0 },
                }}
              >
                <Typography
                  variant='h1'
                  component='h1'
                  className='slide-title'
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
                    fontWeight: 'bold',
                    mb: 2,
                    lineHeight: 1.2,
                    opacity: 0,
                    transform: 'translateY(100px)',
                  }}
                >
                  {slideContents[index]?.title}
                </Typography>
                <Typography
                  variant='h5'
                  component='p'
                  className='slide-subtitle'
                  sx={{
                    mb: 4,
                    fontWeight: 300,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                    lineHeight: 1.4,
                    opacity: 0,
                    transform: 'translateX(-100px)',
                  }}
                >
                  {slideContents[index]?.subtitle}
                </Typography>
                <Button
                        variant='outlined'
                        size='large'
                        className='slide-button'
                        sx={{
                          display:'flex',  
                          justifyContent: 'space-between',
                          color: theme.palette.text.secondary,
                          width: '250px',
                          height: '50px',
                          borderRadius: '100px',
                          borderColor: theme.palette.text.secondary,
                          px: { xs: 2, md: 3 },
                          py: { xs: 1, md: 1.5 },
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          opacity: 0,
                          transform: 'translateY(-50px)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0, 
                            width: '0%',
                            height: '100%',
                            backgroundColor: theme.palette.primary.light,
                            transition: 'width 0.4s ease-in-out',
                            zIndex: -1,
                          },
                          '&:hover': {
                            borderColor: theme.palette.text.secondary,
                            transform: 'translateY(-2px)',
                            '&::before': {
                              width: '100%',
                              right: 0,
                            },
                          },
                          '&:not(:hover)::before': {
                            width: '0%',
                            right: 0,
                          },
                          transition: 'all 0.3s ease',
                        }}
                        >
                            {slideContents[index]?.buttonText}
                            <ArrowForwardIosSharpIcon
                                sx={{
                                    backgroundColor: theme.palette.primary.light,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '100px',
                                    padding: '6px',
                                    transition: 'all 0.3s ease',
                                    '.MuiButton-root:hover &': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: theme.palette.primary.light,
                                    }
                                }}
                            />
                        </Button>  
              </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};