'use client'
import React from 'react';
import {Box, Container, Typography,  IconButton, Paper, useTheme} from '@mui/material';
import {PlayArrow, CheckCircle, Verified, Nature} from '@mui/icons-material';
import { ButtonContact } from '@/shared/components';
import Image from 'next/image';

const HomeWhyUs = () => {
  const theme = useTheme();
  return (
    <Box sx={{position: 'relative'}}>
        <Box
            sx={{
                position: 'absolute',
                top: -35,
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
                    height: '55px',
                    objectFit: 'cover'
                }}
            />
        </Box>
        <Container sx={{ py: 4, position: 'relative', height: 800  }}>
            <Box
                sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4
                }}
            >
                {/* Ảnh */}
                <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    maxWidth: { md: '50%' }
                }}
                >
                <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                    <Box
                    sx={{
                        width: '100%',
                        height: 650,
                        backgroundImage: 'url(/banner/banner-4.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                    }}
                    >
                    {/* Icon Play */}
                    <Box
                        sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        width: 60,
                        height: 60,
                        backgroundColor: theme.palette.warning.main,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3
                        }}
                    >
                        <IconButton sx={{ color: theme.palette.text.secondary }}>
                        <PlayArrow sx={{ fontSize: theme.typography.body2.fontSize}} />
                        </IconButton>
                    </Box>
                    </Box>
                </Box>
                </Box>

                {/* Thông tin */}
                <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    maxWidth: { md: '50%' },
                    pl: { md: 3 },
                    mt:5
                }}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    Tại sao nên chọn sản phẩm tại Rynan Smart Agriculture?
                    </Typography>
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    mb: 3,
                    }}
                >
                    Mang lại giá trị thực cho nông nghiệp bền vững
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                    mb: 4,
                    }}
                >
                    Tại Rynan Smart Agriculture, chúng tôi cam kết mang đến những sản phẩm và giải pháp ứng dụng công nghệ tiên tiến, góp phần nâng cao năng suất và chất lượng nông sản. Với định hướng phát triển nông nghiệp bền vững, mỗi sản phẩm không chỉ đáp ứng tiêu chuẩn an toàn mà còn giúp tối ưu chi phí và công sức cho người nông dân. Chúng tôi tin rằng giá trị thực đến từ sự đồng hành lâu dài, hiệu quả và tận tâm – vì một nền nông nghiệp hiện đại, thân thiện với môi trường và phát triển vững chắc cho tương lai.
                </Typography>

                    <ButtonContact text="Đọc Thêm"/>
                </Box>
            </Box>

            {/* Thông tin đặc trưng */}
            <Box sx={{ 
                position: 'absolute', 
                bottom: 50,
                width: '80%',
                right: 25
                }}>
                <Paper
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 3,
                    p: 4,
                    color: 'white'
                }}
                >
                <Box
                    sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4
                    }}
                >
                    {/* Đặc trưng 1 */}
                    <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}
                    >
                    <Box
                        sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: theme.palette.warning.main,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                        }}
                    >
                        <CheckCircle sx={{ color: theme.palette.secondary.main, fontSize: 24 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Hiệu quả tối ưu cho cây trồng
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9}}>
                        Tăng năng suất, cải thiện chất lượng nông sản nhờ công thức dinh dưỡng cân đối, phù hợp với từng loại cây và giai đoạn sinh trưởng.
                    </Typography>
                    </Box>

                    {/* Feature 2 */}
                    <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}
                    >
                    <Box
                        sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: theme.palette.warning.main,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                        }}
                    >
                        <Verified sx={{ color: theme.palette.secondary.main, fontSize: 24 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Chất lượng đạt tiêu chuẩn
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                        Được sản xuất theo quy trình hiện đại, kiểm soát nghiêm ngặt – đảm bảo an toàn cho cây trồng, đất và người sử dụng.
                    </Typography>
                    </Box>

                    {/* Feature 3 */}
                    <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}
                    >
                    <Box
                        sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: theme.palette.warning.main,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                        }}
                    >
                        <Nature sx={{ color: theme.palette.secondary.main, fontSize: 24 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Thân thiện với môi trường
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                        Giảm thiểu tồn dư hóa chất, bảo vệ hệ vi sinh vật đất – hướng tới canh tác bền vững và phát triển nông nghiệp xanh.
                    </Typography>
                    </Box>
                </Box>
                </Paper>
            </Box>
        </Container>
    </Box>
  );
};

export default HomeWhyUs;