'use client';
import { Button } from '@/shared/components';
import { Quantity } from '@/shared/components/ui/Quantity';
import { Star } from '@mui/icons-material';
import { Box, Card, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useCallback, useState, useRef } from 'react';

export const ProductDetailInfo = () => {
    const theme = useTheme();
    const images = [
        '/banner/banner-1.jpg',
        '/banner/banner-2.jpg',
        '/banner/banner-3.jpg',
    ];

    const [selectedImage, setSelectedImage] = useState<string>(images[0]);
    const [quantity, setQuantity] = useState<number | string>(1);
    // Xử lý khi phóng to ảnh
    const [showZoom, setShowZoom] = useState<boolean>(false);
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    const handleQuantity = useCallback((value: string) => {
        if (value === '') {
            setQuantity(''); 
            return;
        }
        const num = Number(value);
        if (!isNaN(num) && num >= 1 && num <= 999) {
            setQuantity(num);
        }
    }, []);

    const handleChangeQuantity = useCallback((flag: string) => {
        const currentQty = typeof quantity === 'string' ? 
            (quantity === '' ? 1 : Number(quantity)) : quantity;
        
        if (flag === 'minus' && currentQty > 1) {
            setQuantity(currentQty - 1);
        } else if (flag === 'plus' && currentQty < 999) {
            setQuantity(currentQty + 1);
        }
    }, [quantity]);

    const handleBuyNow = () => {
        const finalQuantity = typeof quantity === 'string' ? 
            (quantity === '' ? 1 : Number(quantity)) : quantity;
        alert(`Mua ngay ${finalQuantity} sản phẩm!`);
    };

    const handleAddToCart = () => {
        const finalQuantity = typeof quantity === 'string' ? 
            (quantity === '' ? 1 : Number(quantity)) : quantity;
        alert(`Đã thêm ${finalQuantity} sản phẩm vào giỏ hàng!`);
    };

    // Xử lý khi di chuyển chuột vào ảnh
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Tính toán vị trí để zoom chính xác
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        setZoomPosition({ x: xPercent, y: yPercent });
    };

    const handleMouseEnter = () => {
        setShowZoom(true);
    };

    const handleMouseLeave = () => {
        setShowZoom(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                gap: 5
            }}
        >
            {/* Hiển thị ảnh sản phẩm */}
            <Box sx={{width: '50%', position: 'relative'}}>
                {/* Ảnh lớn */}
                <Card sx={{ position: 'relative' }}>
                    <Box
                        ref={imageRef}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '5 / 4',
                            cursor: 'zoom-in',
                            overflow: 'hidden'
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Image
                            src={selectedImage}
                            fill
                            alt='VETAMATE 210'
                            style={{ objectFit: 'cover' }}
                        />
                    </Box>
                </Card>

                {/* Ô phóng to */}
                {showZoom && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: '105%',
                            width: '100%',
                            height: '86%',
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            boxShadow: theme.shadows[8],
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    >
                        <Image
                            src={selectedImage}
                            alt='Zoomed view'
                            width={1600}
                            height={1280}
                            style={{
                                objectFit: 'cover',
                                transform: `translate(-${(zoomPosition.x / 100) * 1200}px, -${(zoomPosition.y / 100) * 960}px)`,
                                transition: 'transform 0.05s ease'
                            }}
                        />
                    </Box>
                )}

                {/* Danh sách ảnh nhỏ */}
                <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                    {images.map((img, index) => (
                        <Card
                            key={index}
                            sx={{
                                width: 100, 
                                border: selectedImage === img ? 
                                    `2px solid ${theme.palette.primary.dark}` : 
                                    `1px solid ${theme.palette.text.secondary}`,
                                cursor: 'pointer',
                                opacity: selectedImage === img ? 1 : 0.7,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 1,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            onClick={() => setSelectedImage(img)}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '5 / 4',
                                }}
                            >
                                <Image
                                    src={img}
                                    fill
                                    alt={`Thumbnail ${index + 1}`}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        </Card>
                    ))}
                </Box>
            </Box>

            {/* Hiển thị thông tin sản phẩm */}
            <Box
                sx={{
                    width: '50%'
                }}
            >
                <Typography
                    variant='h6'
                    sx={{
                        color: theme.palette.primary.main,
                        fontWeight: theme.typography.fontWeightBold
                    }}
                >
                    RYNAN® VETAMATE 140 NPK 27-08-08+TE (1% HUMIC) - Hũ 1.25kg
                </Typography>

                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        py: 0.5
                    }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Box
                                key={star}
                                sx={{
                                    color: theme.palette.warning.main
                                }}
                            >
                                <Star sx={{
                                    fontSize: theme.typography.body1.fontSize
                                }}/>
                            </Box>
                        ))}
                    </Box>
                    <Typography variant='body1'>
                        (5.0) 
                    </Typography>
                    <Typography variant='body1'>
                        - 12 lượt đánh giá
                    </Typography>
                </Box>

                <Box sx={{py: 0.5}}>
                    <Typography variant='h6' sx={{ 
                        color: theme.palette.error.main,
                        fontWeight: 'bold'
                    }}>
                        85.000 VNĐ
                    </Typography>
                </Box>
                <Box sx={{py: 0.5}}>
                    <Typography variant='body1' color='text.primary' fontWeight='bold'>
                        Đơn Vị:
                    </Typography>
                    <Typography
                        sx={{
                            backgroundColor: theme.palette.primary.light,
                            width: '25%',
                            textAlign: 'center',
                            p: 1,
                            mt: 0.5,
                            borderRadius: 1,
                            color: theme.palette.text.secondary,
                            fontWeight: theme.typography.fontWeightMedium
                        }}
                    >
                        V39VLE03002 1.25 Kg
                    </Typography>
                </Box>

                <Box sx={{py: 0.5,}}>
                    <Typography variant='body1' fontWeight='bold' marginBottom={0.5}>
                        Số lượng
                    </Typography>
                    <Quantity
                        quantity={quantity}
                        handleChangeQuantity={handleChangeQuantity}
                        handleQuantity={handleQuantity}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 3, width: '100%' }}>
                    <Button
                        name='Mua ngay'
                        handleOnClick={handleAddToCart}
                    />
                    <Button
                        name='Thêm vào giỏ hàng'
                        handleOnClick={handleBuyNow}
                    />
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant='h6' sx={{ 
                        mb: 2, 
                        color: theme.palette.text.primary,
                        fontWeight: theme.typography.fontWeightBold,
                        borderBottom: `2px solid ${theme.palette.primary.light}`,
                        pb: 1
                    }}>
                        
                    </Typography>
                    
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr',
                        gap: 2,
                        mt: 2
                    }}>
                        {/* Danh mục */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.primary.light}`
                        }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: '50%',
                                mr: 1.5
                            }} />
                            <Box>
                                <Typography variant='body1' sx={{ 
                                    color: theme.palette.text.secondary,
                                }}>
                                    Danh mục
                                </Typography>
                                <Typography variant='body2' sx={{ 
                                    fontWeight: theme.typography.fontWeightMedium,
                                    color: theme.palette.text.secondary
                                }}>
                                    Phân bón dùng cho rau cải
                                </Typography>
                            </Box>
                        </Box>

                        {/* SKU */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.primary.light}`
                        }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: theme.palette.info.main,
                                borderRadius: '50%',
                                mr: 1.5
                            }} />
                            <Box>
                                <Typography variant='body1' sx={{ 
                                    color: theme.palette.text.secondary,
                                }}>
                                    SKU
                                </Typography>
                                <Typography variant='body2' sx={{ 
                                    fontWeight: theme.typography.fontWeightMedium,
                                    color: theme.palette.text.secondary,
                                }}>
                                    RSA00123
                                </Typography>
                            </Box>
                        </Box>
                        {/* Lượt bán */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.primary.main}`
                        }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: theme.palette.success.main,
                                borderRadius: '50%',
                                mr: 1.5
                            }} />
                            <Box>
                                <Typography variant='body1' sx={{ 
                                    color: theme.palette.text.secondary,
                                }}>
                                    Đã bán
                                </Typography>
                                <Typography variant='body2' sx={{ 
                                    fontWeight: theme.typography.fontWeightMedium,
                                    color: theme.palette.text.secondary
                                }}>
                                    205 sản phẩm
                                </Typography>
                            </Box>
                        </Box>

                        {/* Tồn kho */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.primary.light}`
                        }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: theme.palette.warning.main,
                                borderRadius: '50%',
                                mr: 1.5
                            }} />
                            <Box>
                                <Typography variant='body1' sx={{ 
                                    color: theme.palette.text.primary,
                                }}>
                                    Số lượng
                                </Typography>
                                <Typography variant='body2' sx={{ 
                                    fontWeight: theme.typography.fontWeightMedium,
                                    color: theme.palette.text.secondary
                                }}>
                                    100 sản phẩm
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};