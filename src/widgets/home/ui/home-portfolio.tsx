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
            text: 'Phân bón thông minh là loại phân bón được thiết kế với công nghệ tiên tiến giúp giải phóng chất dinh dưỡng theo thời gian hoặc theo điều kiện môi trường như độ ẩm, nhiệt độ, độ pH... '
        },
        {
            title: 'Thiết Bị Thông Minh',
            text: 'Phân bón thông minh là loại phân bón được thiết kế với công nghệ tiên tiến giúp giải phóng chất dinh dưỡng theo thời gian hoặc theo điều kiện môi trường như độ ẩm, nhiệt độ, độ pH... '
        },
        {
            title: 'Thiết Bị Thông Minh',
            text: 'Phân bón thông minh là loại phân bón được thiết kế với công nghệ tiên tiến giúp giải phóng chất dinh dưỡng theo thời gian hoặc theo điều kiện môi trường như độ ẩm, nhiệt độ, độ pH... '
        },
    ]
        
    
    return (
        <Box sx={{ position: 'relative', backgroundColor: theme.palette.primary.main }}>
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
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    gap: 2 ,
                    pt:5,
                    pb: 10
                }}
            >
                {content.map((el, index) => (
                    <Box key={index}>
                        <Box
                            sx={{
                                position: 'relative',
                                my: 1,
                                backgroundImage: 'url(/portfolio/box-portfolio-1.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '22vw',
                                height: '27vw',
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease', 
                                overflow: 'hidden', 
                                '&:hover': {
                                    transform: 'scale(1.02)' 
                                }
                            }}
                            onMouseEnter={() => setIsHovered(index)}
                            onMouseLeave={() => setIsHovered(null)}
                        >
                            <Typography
                                variant='h5'
                                sx={{
                                    position: 'absolute',
                                    color: theme.palette.text.primary,
                                    textAlign: 'center',
                                    backgroundColor: theme.palette.text.secondary,
                                    bottom: 30,
                                    p: 2,
                                    borderRadius: '15px',
                                    opacity: isHovered === index ? 0 : 1, 
                                    transition: 'opacity 0.3s ease'
                                }}
                            >
                                {el?.title}
                            </Typography>
                            
                            {/* Overlay khi hover - slide up từ dưới */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '10px',
                                    transform: isHovered === index ? 'translateY(0)' : 'translateY(100%)', // Slide từ dưới lên
                                    transition: 'transform 0.4s ease-out',
                                    pointerEvents: isHovered === index ? 'auto' : 'none',
                                    overflow: 'hidden' 
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        width: '20vw',
                                        height: '20vw',
                                        color: 'white',
                                        textAlign: 'center',
                                        p: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '15px',
                                        backdropFilter: 'blur(10px)',
                                        transform: isHovered === index ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                                        transition: 'all 0.4s ease-out 0.1s'
                                    }}
                                >
                                    <Typography variant='h5' 
                                        sx={{
                                            mb:4,
                                            position: 'relative',
                                            '&::before': {
                                                position: 'absolute',
                                                content: '""',
                                                bottom: -10,
                                                left: '35%',
                                                width: '100px',
                                                height: '2px',
                                                backgroundColor: theme.palette.primary.light
                                            }
                                        }}
                                    >
                                        {el?.title}
                                    </Typography>
                                    <Typography>
                                        {el?.text}
                                    </Typography>
                                    <Button
                                        sx={{
                                            backgroundColor: theme.palette.primary.light,
                                            mt:4,
                                        }}
                                    >
                                        <Typography component='a' href='/' sx={{textDecoration:'none', color: theme.palette.text.secondary,}}>Xem Thêm</Typography>
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