'use client'
import { ButtonContact } from "@/shared/components"
import { Box, Container, Typography, useTheme } from "@mui/material";
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp';
import GradeSharpIcon from '@mui/icons-material/GradeSharp';
import SavedSearchSharpIcon from '@mui/icons-material/SavedSearchSharp';
import SupervisedUserCircleSharpIcon from '@mui/icons-material/SupervisedUserCircleSharp';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import Image from "next/image"
import { useState } from "react";

export const HomeAbout = () => {
    const theme = useTheme();
    const [isFlipped, setIsFlipped] = useState<number | null>(null);
    return (
        <Box sx={{
            position: 'relative',
            }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: -43,
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
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 2,
                    pt:1,
                    pb:5
                }}
            >
                <Box
                    sx={{
                        width: {xs: '100%', md: '65%'}
                    }}
                >
                    <Box>
                        <Typography variant='body1' 
                        sx={{
                            color: theme.palette.primary.main
                        }}>
                            Chúng tôi có hơn 10 năm kinh nghiệm trong lĩnh vực nông nghiệp và thiết bị thông tin
                        </Typography>
                        <Typography variant='h4'
                        sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            py:1
                        }}>
                            Cung cấp các sản phẩm tốt nhất cho đến tay bà con nông dân
                        </Typography>
                        <Typography variant='body1'>Rynan Smart Agriculture là doanh nghiệp tiên phong trong lĩnh vực nông nghiệp thông minh tại Việt Nam, dẫn đầu trong nghiên cứu và phát triển các loại phân bón kiểm soát, thiết bị cảm biến, và hệ sinh thái IoT – AI tích hợp. Các sản phẩm và giải pháp của Rynan giúp nâng cao năng suất cây trồng, tối ưu chi phí sản xuất và giảm thiểu tác động đến môi trường, hướng đến một nền nông nghiệp hiện đại và hiệu quả.</Typography>
                        <Typography variant='body1' sx={{my:2}}>Không chỉ chú trọng đổi mới công nghệ, Rynan còn đặt mục tiêu xây dựng một hệ sinh thái nông nghiệp bền vững thông qua việc cung cấp các công cụ quản lý và giám sát thông minh. Với đội ngũ chuyên gia giàu kinh nghiệm, Rynan mang đến những giải pháp toàn diện – từ phân bón, hệ thống quan trắc môi trường, đến nền tảng phân tích dữ liệu và trí tuệ nhân tạo – góp phần thúc đẩy quá trình chuyển đổi số trong ngành nông nghiệp Việt Nam.</Typography>
                    </Box>
                    <Box sx={{mb:3}}>
                        <ButtonContact text="Thông tin"/>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '400px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                filter: 'brightness(0.9)',
                                transform: 'scale(1.01)' 
                            },
                        }}
                        >
                        <Image
                            src="/banner/banner-4.jpg"
                            alt="banner-4"
                            fill
                            style={{
                            objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Box>
                    <Box
                        sx={{width: {xs: '100%', md: '35%'}, display: {xs: 'none', md: 'flex'}, flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer'}}
                    >
                    {/* Box 1 */}
                    <Box
                        onMouseEnter={() => setIsFlipped(1)}
                        onMouseLeave={() => setIsFlipped(null)}
                        sx={{
                            height: '30%',
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transform: isFlipped === 1 ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            transition: 'transform 0.6s ease-in-out'
                        }}
                    >
                        {/* Mặt trước */}
                        <Box
                        sx={{
                            backgroundColor: theme.palette.primary.light,
                            p:3,
                            position: 'absolute',
                            borderRadius: '10px',
                            backfaceVisibility: 'hidden',
                            height: '100%',
                            color: theme.palette.text.secondary,
                        }}
                        >
                            <Box sx={{backfaceVisibility: 'hidden',display: 'flex', flexDirection: 'column', justifyContent: 'center',border: '1px dotted #fff', height: '100%', borderRadius: '10px', p:1}}>
                                <Box 
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                    <Typography variant='body2'>Lượt sản phẩm bán ra</Typography>
                                    <Typography component='span' 
                                        sx={{
                                            backgroundColor: theme.palette.secondary.main,
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                        <EmojiEventsSharpIcon />
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant='h4' sx={{fontWeight: theme.typography.fontWeightBold, py:2}}>123.457+</Typography>
                                </Box>
                                <Box>
                                    <Typography>Luôn đẩy mạnh đổi mới công nghệ để phát triển các dòng sản phẩm chất lượng hơn nữa.</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.light,
                                p:3,
                                borderRadius: '10px',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                color: theme.palette.text.secondary,
                                position: 'absolute',
                                transform: 'rotateY(180deg)',
                            }}
                        >
                            <Box sx={{backfaceVisibility: 'hidden',display: 'flex', flexDirection: 'column', justifyContent: 'center',border: '1px dotted #fff', height: '100%', borderRadius: '10px', p:1}}>
                                <Box 
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                    <Typography variant='body2'>Khách hàng tin tưởng</Typography>
                                    <Typography component='span' 
                                        sx={{
                                            backgroundColor: theme.palette.secondary.main,
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                        <SupervisedUserCircleSharpIcon />
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant='h4' sx={{fontWeight: theme.typography.fontWeightBold, py:2}}>234.567+</Typography>
                                </Box>
                                <Box>
                                    <Typography>Cảm ơn đối tác và quý khách hàng đã sử dụng các sản phẩm tại công ty chúng tôi.</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {/* Box 2 */}
                    <Box
                        onMouseEnter={() => setIsFlipped(2)}
                        onMouseLeave={() => setIsFlipped(null)}
                        sx={{
                            height: '68%',
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transform: isFlipped === 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            transition: 'transform 0.6s ease-in-out'
                        }}
                    >
                        {/* Mặt trước */}
                        <Box sx={{
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            position: 'absolute',
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.text.secondary,
                            borderRadius: '10px',
                            p:3
                        }}>
                            <Box sx={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',border: '1px dotted #fff', height: '100%', borderRadius: '10px', p:1 
                            }}>
                                <Box>
                                    <Box sx={{display: 'flex', gap: 1, mb:2}}>
                                        <CheckCircleOutlineSharpIcon/>
                                        <Typography>Công nghệ sản xuất hiện đại</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: 1, mb:2}}>
                                        <CheckCircleOutlineSharpIcon/>
                                        <Typography>An toàn – Hiệu quả – Bền vững</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: 1, mb:2}}>
                                        <CheckCircleOutlineSharpIcon/>
                                        <Typography>Chất lượng đảm bảo, nông dân an tâm</Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{width: '100%', height: '1px'}}></Typography>
                                <Box 
                                    sx={{
                                        position: 'relative',
                                        my:2,
                                        '&::after':{
                                            content:'""',
                                            width: '100%',
                                            height: '1px',
                                            position:'absolute',
                                            top: 0,
                                            backgroundColor: theme.palette.text.secondary
                                        }
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap:2, my:3}}>
                                        <Typography component='span'
                                            sx={{
                                            backgroundColor: theme.palette.text.secondary,
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center' 
                                            }}
                                        >
                                            <SavedSearchSharpIcon sx={{color: theme.palette.primary.dark}}/>
                                        </Typography>
                                        <Typography variant='h6'sx={{textTransform: 'uppercase', fontWeight: theme.typography.fontWeightBold}}>An toàn & Hiệu quả</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex',  alignItems: 'center', gap:2, my:3}}>
                                        <Typography component='span'
                                            sx={{
                                            backgroundColor: theme.palette.text.secondary,
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center' 
                                            }}
                                        >
                                            <GradeSharpIcon sx={{color: theme.palette.primary.dark}}/>
                                        </Typography>
                                        
                                        <Typography variant='h6' sx={{textTransform: 'uppercase',fontWeight: theme.typography.fontWeightBold}}>Bền vững & Tin cậy</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            mx:2,
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&:hover':{
                                                backgroundColor: theme.palette.primary.dark
                                            },
                                            '&::after': {
                                                content: '""',
                                                width: '55px',
                                                bottom: -2,
                                                left: 0,
                                                height: '1px',
                                                backgroundColor: theme.palette.text.secondary,
                                                position: 'absolute'
                                            }
                                        }}
                                    >Liên hệ</Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Mặt sau */}
                        <Box sx={{
                            height: '100%',
                            position: 'absolute',
                            backfaceVisibility: 'hidden',
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.text.secondary,
                            borderRadius: '10px',
                            p:3,
                            transform: 'rotateY(180deg)'
                        }}>
                            <Box sx={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',border: '1px dotted #fff', height: '100%', borderRadius: '10px', p:1 
                            }}>
                                <Box>
                                    <Box sx={{display: 'flex', gap: 1, mb:2}}>
                                        <CheckCircleOutlineSharpIcon/>
                                        <Typography>Giải pháp thông minh – Nâng tầm canh tác</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: 1, mb:2}}>
                                        <CheckCircleOutlineSharpIcon/>
                                        <Typography>Tiết kiệm chi phí – Tăng năng suất vượt trội</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: 1, mb:2}}>
                                        <CheckCircleOutlineSharpIcon/>
                                        <Typography>Thân thiện môi trường – Phát triển bền vững</Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{width: '100%', height: '1px'}}></Typography>
                                <Box 
                                    sx={{
                                        position: 'relative',
                                        my:2,
                                        '&::after':{
                                            content:'""',
                                            width: '100%',
                                            height: '1px',
                                            position:'absolute',
                                            top: 0,
                                            backgroundColor: theme.palette.text.secondary
                                        }
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap:2, my:3}}>
                                        <Typography component='span'
                                            sx={{
                                            backgroundColor: theme.palette.text.secondary,
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center' 
                                            }}
                                        >
                                            <NewReleasesOutlinedIcon sx={{color: theme.palette.primary.dark}}/>
                                        </Typography>
                                        <Typography variant='h6'sx={{textTransform: 'uppercase', fontWeight: theme.typography.fontWeightBold}}>Chất lượng & Uy tín</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex',  alignItems: 'center', gap:2, my:3}}>
                                        <Typography component='span'
                                            sx={{
                                            backgroundColor: theme.palette.text.secondary,
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center' 
                                            }}
                                        >
                                            <CachedOutlinedIcon sx={{color: theme.palette.primary.dark}}/>
                                        </Typography>
                                        
                                        <Typography variant='h6' sx={{textTransform: 'uppercase',fontWeight: theme.typography.fontWeightBold}}>Đổi mới & Hiện đại</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            mx:2,
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&:hover':{
                                                backgroundColor: theme.palette.primary.dark
                                            },
                                            '&::after': {
                                                content: '""',
                                                width: '55px',
                                                bottom: -2,
                                                left: 0,
                                                height: '1px',
                                                backgroundColor: theme.palette.text.secondary,
                                                position: 'absolute'
                                            }
                                        }}
                                    >Liên hệ</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}