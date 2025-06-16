'use client'
import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LocationOn,
  Phone,
  Email,
  Schedule,
} from '@mui/icons-material';
import Image from 'next/image';


export const Footer: React.FC = () => {
    const theme = useTheme();


    const quickLinks = [
        'Trang chủ',
        'Liên hệ',
        'Giới thiệu',
        'Giỏ hàng',
        'Tài khoản',
    ];
    const infoLinks = [
        'Hình thức thanh toán',
        'Chính sách giao hàng',
        'Chính sách bảo hành',
        'Chính sách bảo mật thanh toán',
        'Chính sách giải quyết khiếu nại',
        'Kênh người bán'
    ];
    const aboutLinks = [
        'Giới thiệu',
        'Hướng dẫn mua hàng',
        'Quy chế hoạt động sàn GDTMĐT',
        'Đổi trả sản phẩm',
        'Chính sách bảo mật thông tin',
        'Chính sách và quy định chung',
    ]

    return (
        <Box
            component='footer'
            sx={{
                background: theme.palette.primary.main,
                color: theme.palette.text.secondary,
                py: 7,
                position: 'relative',
                '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundImage: 'url(/shape/7.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'none', md: 'block' },
                width: '50%',
                height: '100%'
            }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -17,
                    width: '100%',
                    zIndex: 10,
                    }}>
                    <Image
                        src='/shape/grass-2.png'
                        alt='page-title-top'
                        width={0}
                        height={0}
                        sizes="110vw"
                        style={{
                            width: '100%',
                            height: '20px',
                            objectFit: 'cover'
                        }}
                    />
            </Box>
            <Container  sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    flexWrap='wrap'
                    gap={2}
                >
                    <Box display='flex' alignItems='center' gap={2}>
                        <Image
                            src='/logo/SMART-AGRICULTURE_LOGO_BRIGHT-MODE-01.png'
                            alt='logo'
                            width={300}
                            height={80}
                        />
                    </Box>
                    <Box display='flex' gap={1}>
                        {[Facebook, Twitter, Instagram, LocationOn].map((Icon, index) => (
                        <IconButton
                            key={index}
                            sx={{
                            backgroundColor: theme.palette.warning.main,
                            color: theme.palette.text.secondary,
                            width: 40,
                            height: 40,
                            '&:hover': {
                                backgroundColor: theme.palette.warning.light,
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                            }}
                        >
                            <Icon fontSize='small' />
                        </IconButton>
                        ))}
                    </Box>
                </Box>
                <Box
                    display='flex'
                    flexWrap="wrap"
                    gap={2}
                    justifyContent='space-between'
                    marginTop={5}
                >
                    <Box flex={{ xs: '1 1 100%', md: '1 1 23%' }} >
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Liên Hệ
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" alignItems="flex-start" gap={1}>
                                <LocationOn sx={{ color: theme.palette.warning.main, mt: 0.5 }} />
                                <Typography variant="body1">
                                Khu CN Long Đức, xã Long Đức<br />
                                TP. Trà Vinh, Tỉnh Trà Vinh
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Phone sx={{ color: theme.palette.warning.main }} />
                                <Typography variant="body1">Điện Thoại: 012345678</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Email sx={{ color: theme.palette.warning.main }} />
                                <Typography variant="body1">Mail: inforynan@gmail.com</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Schedule sx={{ color: theme.palette.warning.main }} />
                                <Typography variant="body1">T2 - T6: 8.00am - 17.00pm</Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* Thông tin */}
                    <Box flex={{ xs: '1 1 100%', md: '1 1 23%' }} >
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Về Rynan
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                        {aboutLinks.map((link, index) => (
                            <Link
                            key={index}
                            href="#"
                            underline="none"
                            variant='body1'
                            sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                color:  theme.palette.warning.main,
                                transform: 'translateX(5px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            >
                            {link}
                            </Link>
                        ))}
                        </Box>
                    </Box>
                    {/* Thông tin cần biết */}
                    <Box flex={{ xs: '1 1 100%', md: '1 1 23%' }} >
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Thông tin
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                        {infoLinks.map((link, index) => (
                            <Link
                            key={index}
                            href="#"
                            underline="none"
                            sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                color: theme.palette.warning.main,
                                transform: 'translateX(5px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            >
                            {link}
                            </Link>
                        ))}
                        </Box>
                    </Box>
                    {/* Link liên kết */}
                    <Box flex={{ xs: '1 1 100%', md: '1 1 22%' }} >
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Liên kết
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                        {quickLinks.map((link, index) => (
                            <Link
                            key={index}
                            href="#"
                            underline="none"
                            sx={{
                                color:theme.palette.text.secondary,
                                '&:hover': {
                                color: theme.palette.warning.main,
                                transform: 'translateX(5px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            >
                            {link}
                            </Link>
                        ))}
                        </Box>
                    </Box>
                </Box>
                <Box mt={5}>
                    <Divider sx={{ borderColor: theme.palette.text.secondary, mb: 3 }} />
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        flexWrap='wrap'
                        gap={2}
                    >
                        <Typography variant='body1' sx={{ color: theme.palette.text.secondary }}>
                            Copyright © 2025 by Kien
                            . All Rights Reserved.
                        </Typography>
                        <Box display="flex" gap={3} flexWrap="wrap">
                        {[
                            'Bảo mật & Quyền riêng tư',
                            'Thông tin pháp lý',
                            'Chính sách hoàn trả và hoàn lại',
                        ].map((link, index) => (
                            <Link
                                variant='body1'
                                key={index}
                                href="#"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    '&:hover': {
                                    color: theme.palette.warning.main,
                                    },
                                    '&:before': {
                                    content: index > 0 ? '"✓"' : '""',
                                    color: '#4CAF50',
                                    },
                                }}
                            >
                            {link}
                            </Link>
                        ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
