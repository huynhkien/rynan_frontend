'use client'
import { Box, Container, Typography, useTheme } from "@mui/material"
import Image from "next/image";
import { useState } from "react";
export const AboutWelcome = () => {
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
                title: 'Công Nghệ Nông Nghiệp',
                text: 'Phân bón thông minh là loại phân bón được thiết kế với công nghệ tiên tiến giúp giải phóng chất dinh dưỡng theo thời gian hoặc theo điều kiện môi trường như độ ẩm, nhiệt độ, độ pH... '
            },
            {
                title: 'Công Nghệ Nông Nghiệp',
                text: 'Phân bón thông minh là loại phân bón được thiết kế với công nghệ tiên tiến giúp giải phóng chất dinh dưỡng theo thời gian hoặc theo điều kiện môi trường như độ ẩm, nhiệt độ, độ pH... '
            },
        ]
            
        // Debug function
        const handleMouseEnter = (index: number) => {
            setIsHovered(index);
        }
        
        const handleMouseLeave = () => {
            setIsHovered(null);
        }
    const theme = useTheme();
    return (
        <Box>
            <Container sx={{
                py:4,
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                justifyContent: {xs: 'center', md: 'space-around'},
                gap: 5
                }}>
                <Box
                    sx={{
                        width: {xs: '100%', md: '40%'}
                    }}
                >
                    <Typography
                        variant='body1'
                        sx={{
                            color: theme.palette.primary.main
                        }}
                    >
                        Chào mừng bạn đến với Rynan Smart Agriculture
                    </Typography>
                    <Typography
                        variant='h4'
                        sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            py:1
                        }}>
                        Tiên phong trong lĩnh vực nông nghiệp sạch và công nghệ cao
                    </Typography>            
                </Box>
                <Box
                    sx={{
                        width: {xs: '100%', md: '60%'}
                    }}
                >
                    <Typography variant='body1'>Rynan Smart Agriculture là doanh nghiệp tiên phong trong lĩnh vực nông nghiệp thông minh tại Việt Nam, dẫn đầu trong nghiên cứu và phát triển các loại phân bón kiểm soát, thiết bị cảm biến, và hệ sinh thái IoT – AI tích hợp. Các sản phẩm và giải pháp của Rynan giúp nâng cao năng suất cây trồng, tối ưu chi phí sản xuất và giảm thiểu tác động đến môi trường, hướng đến một nền nông nghiệp hiện đại và hiệu quả.</Typography>
                    <Typography variant='body1' sx={{my:2}}>Không chỉ chú trọng đổi mới công nghệ, Rynan còn đặt mục tiêu xây dựng một hệ sinh thái nông nghiệp bền vững thông qua việc cung cấp các công cụ quản lý và giám sát thông minh. Với đội ngũ chuyên gia giàu kinh nghiệm, Rynan mang đến những giải pháp toàn diện – từ phân bón, hệ thống quan trắc môi trường, đến nền tảng phân tích dữ liệu và trí tuệ nhân tạo – góp phần thúc đẩy quá trình chuyển đổi số trong ngành nông nghiệp Việt Nam.</Typography>
                </Box>
            </Container>
            <Box sx={{pb:5}}>
                <Box 
                sx={{ 
                    position: 'relative', 
                    height: {xs: '1250px', md: '900px'},
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        backgroundColor: theme.palette.primary.main,
                        bottom: 0,
                        left: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: { xs: 'block', md: 'block' },
                        width: '100%',
                        height: {xs: '80%', md: '66%'},
                        zIndex: 1
                    },
                }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: {xs: '16%', md: '28%'},
                            width: '100%',
                            zIndex: 2
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
                                height: '65px',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: {xs: -18, md: -15},
                            width: '100%',
                            zIndex: 2
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
                                height: '65px',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                    {/* Nội dung 1 */}
                    <Container
                        maxWidth="xl"
                        sx={{
                            display: 'flex',
                            flexDirection: {xs: 'row', md: 'row'},
                            justifyContent: 'center',
                            flexWrap: {xs: 'wrap', md: 'nowrap'},
                            alignItems: 'center',
                            position: 'relative',
                            gap: { xs: 5, md: 2 },
                            pt: 5,
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
                                        backgroundImage: 'url(/portfolio/box-portfolio-1.jpg)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: { xs: '200px', md: '380px' },
                                        height: { xs: '300px', md: '450px' },
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
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Container>
                    <Container
                        maxWidth="xl"
                        sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', md: 'row'},
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            position: 'relative',
                            gap: { xs: 1, md: 2 },
                            pt: 5,
                            pb: 10,
                            zIndex: 2
                        }}
                    >
                        <Box
                            sx={{
                                width: {xs: '100%', md: '50%'},
                                backgroundColor: theme.palette.secondary.main,
                                p: {xs: 1, md: 3},
                                color: theme.palette.text.secondary,
                                borderRadius: '10px',
                                textAlign: 'center',
                                cursor: 'pointer'

                            }}
                        >
                            <Box sx={{border: `1px dotted ${theme.palette.text.secondary}`, p: {xs: 1, md: 3}, borderRadius: '10px'}}>
                                <Typography variant='h5' sx={{pb:2}}>
                                    Sứ mệnh của RYNAN
                                </Typography>
                                <Typography>
                                    RYNAN cam kết thúc đẩy sự phát triển của các sản phẩm nông nghiệp tại Việt Nam thông qua việc ứng dụng công nghệ và sản xuất giá trị bền vững, đáp ứng các tiêu chuẩn quốc tế. Chúng tôi hướng đến việc tạo ra một thị trường công bằng, cạnh tranh và minh bạch cho nông sản Việt.
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: {xs: '100%', md: '50%'},
                                color: theme.palette.text.secondary,
                                borderRadius: '10px',
                                backgroundColor: theme.palette.secondary.main,
                                p: {xs: 1, md: 3},
                                textAlign: 'center',
                                cursor: 'pointer'

                            }}
                        >
                            <Box sx={{
                                border: `1px dotted ${theme.palette.text.secondary}`, p: {xs: 1, md: 3}, borderRadius: '10px'
                            }}>
                                <Typography variant='h5' sx={{pb:2}}>
                                Tầm nhìn của RYNAN
                                </Typography>
                                <Typography>
                                    RYNAN hướng đến trở thành đơn vị tiên phong trong lĩnh vực nông nghiệp thông minh, góp phần nâng cao chất lượng nông sản Việt Nam theo chuẩn toàn cầu. Chúng tôi nỗ lực xây dựng một nền nông nghiệp hiện đại, hiệu quả và phát triển bền vững, mang lại lợi ích cho nông dân, doanh nghiệp và cộng đồng.
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </Box>
    )
}