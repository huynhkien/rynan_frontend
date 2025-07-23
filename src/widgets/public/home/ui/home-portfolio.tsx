'use client'
import { Box, Button, Container, Typography, useTheme } from "@mui/material"
import Image from "next/image"
import { useState } from "react";

export const HomePortfolio = () => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState<number | null>(null);
    const content = [
        {
            title: 'Phân Bón Thông Minh',
            image: '/banner/banner-10.jpg',
            text: 'Ứng dụng công nghệ giải phóng chậm, phân bón thông minh cung cấp dưỡng chất theo nhu cầu thực tế của cây trồng, giảm thất thoát và nâng cao hiệu quả canh tác.',
        },
        {
            title: 'Thiết Bị Canh Tác Thông Minh',
            image: '/banner/banner-13.png',
            text: 'Từ cảm biến độ ẩm, hệ thống tưới nhỏ giọt tự động đến thiết bị giám sát môi trường – nông dân dễ dàng kiểm soát quá trình canh tác mọi lúc, mọi nơi qua điện thoại.',
        },
        {
            title: 'Giải Pháp Công Nghệ Cho Nông Nghiệp',
            image: '/banner/banner-4.jpg',
            text: 'Áp dụng AI, IoT và dữ liệu lớn vào quản lý mùa vụ, dự báo sâu bệnh, tối ưu hóa phân phối và tăng năng suất – hướng tới nền nông nghiệp chính xác và bền vững.',
        },
    ];

        
    // Debug function
    const handleMouseEnter = (index: number) => {
        setIsHovered(index);
    }
    
    const handleMouseLeave = () => {
        setIsHovered(null);
    }
    
    return (
        <Box sx={{ 
            position: 'relative', 
            backgroundColor: theme.palette.primary.main,
            py: 5,
            '&:after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundImage: 'url(/shape/windmill.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'block', md: 'block' },
                width: {xs: '50%', md: '30%'},
                height: {xs: '50%', md: '100%'},
                zIndex: 1
            },
            '&:before': {
                content: '""',
                position: 'absolute',
                top: {md: 0},
                bottom: {xs: 0},
                right: 0,
                backgroundImage: 'url(/shape/7.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'block', md: 'block' },
                width: {xs: '50%', md: '30%'},
                height: {xs: '50%', md: '100%'},
                zIndex: 1
            }
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: -17,
                    width: '100%',
                    zIndex: 5
                }}
            >
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
            
            <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    gap: { xs: 1, md: 2 },
                    pt: 5,
                    pb: 10,
                    zIndex: 2
                }}
            >
                {content.map((el, index) => (
                    <Box 
                        key={index}
                        sx={{
                            flex: '0 0 auto',
                            minWidth: 0 
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                my: 1,
                                backgroundImage: `url(${el.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: { xs: '300px', md: '380px' },
                                height: { xs: '400px', md: '450px' },
                                maxWidth: '380px',
                                maxHeight: '450px',
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.5s ease',
                                overflow: 'hidden',
                                zIndex: isHovered === index ? 20 : 10,
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    zIndex: 30
                                }
                            }}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave()}
                        >                            
                            <Typography
                                variant='h6'
                                sx={{
                                    position: 'absolute',
                                    color: theme.palette.text.primary,
                                    textAlign: 'center',
                                    backgroundColor: theme.palette.text.secondary,
                                    width: '90%',
                                    maxWidth: '280px',
                                    bottom: 30,
                                    py: 2,
                                    px: 1,
                                    fontWeight: theme.typography.fontWeightBold,
                                    borderRadius: '15px',
                                    opacity: isHovered === index ? 0 : 1,
                                    transition: 'opacity 0.5s ease',
                                    zIndex: 5,
                                    fontSize: { xs: '0.9rem', md: '1.1rem' }
                                }}
                            >
                                {el?.title}
                            </Typography>
                            
                            {/* Overlay khi hover */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '10px',
                                    opacity: isHovered === index ? 1 : 0,
                                    visibility: isHovered === index ? 'visible' : 'hidden',
                                    transform: isHovered === index ? 'translateY(0)' : 'translateY(100%)',
                                    transition: 'all 0.5s ease',
                                    zIndex: 15,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        width: '90%',
                                        maxWidth: '380px',
                                        height: '90%',
                                        color: 'white',
                                        textAlign: 'center',
                                        p: { xs: 2, md: 3 },
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '15px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <Typography 
                                        variant='h6' 
                                        sx={{
                                            mb: 3,
                                            position: 'relative',
                                            fontWeight: theme.typography.fontWeightBold,
                                            fontSize: { xs: '0.9rem', md: '1.1rem' },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -8,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '60px',
                                                height: '2px',
                                                backgroundColor: theme.palette.primary.light
                                            }
                                        }}
                                    >
                                        {el?.title}
                                    </Typography>
                                    <Typography 
                                        sx={{ 
                                            mb: 3,
                                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                                            lineHeight: 1.4
                                        }}
                                    >
                                        {el?.text}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            backgroundColor: theme.palette.primary.light,
                                            color: theme.palette.text.secondary,
                                            fontSize: { xs: '0.7rem', md: '0.8rem' },
                                            py: 1,
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.dark,
                                            }
                                        }}
                                        onClick={() => console.log('Button clicked for item:', index)}
                                    >
                                        Xem Thêm
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Container>
        </Box>
    )
}