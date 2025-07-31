'use client'
import { AccessTime, ContactPhone, LocationOn } from '@mui/icons-material'
import { Box, Card, Avatar, CardContent, Stack, Typography, useTheme } from '@mui/material'
import Image from 'next/image'

export const ContactInfo = () => {
    const theme = useTheme();
    return (
        <Box sx={{zIndex:10}}>
            <Box
                sx={{
                    position: 'relative', 
                    width: {xs: '100%', md: '100%'}, 
                    height: {xs: '100%', md: '250px'}, 
                    aspectRatio: '5/4' ,
                    mb:3
                }}
            >
                <Image
                    src='/banner/banner-10.jpg'
                    alt='banner-7'
                    fill
                    style={{
                        borderRadius: '10px'
                    }}
                />
            </Box>
            <Card
                sx={{
                    background: theme.palette.primary.main,
                    borderRadius: 4,
                    color: theme.palette.text.secondary,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <CardContent sx={{ p: {xs:1, md:4}, position: 'relative', zIndex: 1 }}>
                    <Stack spacing={4}>
                    {/* Địa chỉ */}
                    <Box>
                        <Stack direction='row' spacing={2} alignItems='flex-start'>
                            <Avatar
                                sx={{
                                    display: {xs: 'none', md: 'flex'},
                                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                                    width: 56,
                                    height: 56,
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <LocationOn/>
                            </Avatar>
                            <Box flex={1}>
                                <Typography
                                    variant='h6'
                                    sx={{
                                        fontWeight: theme.typography.fontWeightBold,
                                        mb: 1,
                                    }}
                                >
                                    Địa Chỉ
                                </Typography>
                                <Typography
                                    variant='body1'
                                    sx={{
                                    lineHeight: 1.6,
                                    fontWeight: theme.typography.fontWeightLight
                                    }}
                                >
                                        Khu CN Long Đức, phường Long Đức, Tỉnh Vĩnh Long
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Liên hệ */}
                    <Box>
                    <Stack direction='row' spacing={2} alignItems='flex-start'>
                        <Avatar
                            sx={{
                                display: {xs: 'none', md: 'flex'},
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                                width: 56,
                                height: 56,
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <ContactPhone />
                        </Avatar>
                        <Box flex={1}>
                            <Typography
                                variant='h6'
                                sx={{
                                fontWeight: theme.typography.fontWeightBold,
                                mb: 1,
                                }}
                            >
                                Liên Hệ
                            </Typography>
                            <Typography
                                variant='body1'
                                sx={{
                                    fontWeight: theme.typography.fontWeightLight
                                }}
                            >
                                inforynan@gmail.com
                                <br />
                                Liên hệ: + 012 3456 456
                            </Typography>
                        </Box>
                    </Stack>
                    </Box>

                    {/* Hoạt động */}
                    <Box>
                        <Stack direction='row' spacing={2} alignItems='flex-start'>
                            <Avatar
                            sx={{
                                display: {xs: 'none', md: 'flex'},
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                                width: 56,
                                height: 56,
                                backdropFilter: 'blur(10px)',
                            }}
                            >
                                <AccessTime />
                            </Avatar>
                            <Box flex={1}>
                                <Typography
                                    variant='h6'
                                    sx={{
                                    fontWeight: theme.typography.fontWeightBold,
                                    mb: 1,
                                    }}
                                >
                                    Hoạt Động
                                </Typography>
                                <Typography
                                    variant='body1'
                                    sx={{
                                    fontWeight: theme.typography.fontWeightLight
                                    }}
                                >
                                    T2 - T6: 8.00am - 18.00pm
                                    <br />
                                    Hỗ trợ khách hàng 24/24
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                    </Stack>
                </CardContent>
            </Card> 
        </Box>
    )
}