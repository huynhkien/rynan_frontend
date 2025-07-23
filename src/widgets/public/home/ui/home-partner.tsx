'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box } from '@mui/material';
import Image from 'next/image';


const images: string[] = [
  '/logo/logo-1.png', 
  '/logo/logo-2.png', 
  '/logo/logo-3.png', 
  '/logo/logo-4.png',
  '/logo/logo-1.png',
  '/logo/logo-5.png',
  '/logo/logo-2.png',

  
];


export const HomePartner: React.FC = () => {
  return (
    <Box sx={{position: 'relative', py: {md: 5}}}>
        <Box
            sx={{
                position: 'absolute',
                top: -10,
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
                    height: '60px',
                    objectFit: 'cover'
                }}
            />
        </Box>
        <Box sx={{ 
            py:5,
            width: '100%', 
            overflow: 'hidden', 
            position: 'relative',
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
        }}>
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={true}
            autoplay={{ 
            delay: 5000,
            disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={25}
            slidesPerView={5}
            breakpoints={{
                0: {
                slidesPerView: 1,
                },
                480: {
                slidesPerView: 2,
                },
                676: {
                slidesPerView: 3,
                },
                1024: {
                slidesPerView: 4,
                },
                1280: {
                slidesPerView: 6,
                }
            }}
            style={{ height: '100%' }} 
        >
            {images.map((src, index) => (
            <SwiperSlide key={index}>
                <Box sx={{
                    position: 'relative', width: '40%', height: 'auto', aspectRatio: '5/4' 
                }}>
                    <Image
                        src={src}
                        alt='image'
                        fill
                        style={{
                            borderRadius: '10px'
                        }}
                    />
                </Box>
            </SwiperSlide>
            ))}
        </Swiper>
        </Box>
    </Box>
  );
};