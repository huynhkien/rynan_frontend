'use client';
import { getAllCategory } from '@/features/category/api/categoryApi';
import { Category } from '@/features/category/type/categoryType';
import { getAllInventory } from '@/features/inventory/api/inventoryApi';
import { InventoryData } from '@/features/inventory/type/inventoryType';
import { GetProductBySlug } from '@/features/product/api/productApi';
import { Product } from '@/features/product/type/productType';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { Specification } from '@/features/specification/type/specificationType';
import { addToCart } from '@/features/user/store/userSlice';
import { Button } from '@/shared/components';
import { Quantity } from '@/shared/components/ui/public/Quantity';
import { useAppDispatch} from '@/shared/hooks/useAppHook';
import { hideModal, showModal } from '@/shared/store/appSlice';
import { Box, Card, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

export const ProductDetailInfo = ({slug}: {slug: string}) => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [productSlug, setProductSlug] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [qty, setQty] = useState<number>(1);
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [categories, setCategories] = useState<Category[] | []>([]);
    const [inventories, setInventories] = useState<InventoryData[] | []>([]);
    const fetchSpecification = async() => {
        const response = await getAllSpecification();
        if(response.success) setSpecification(response.data || []);
    }
    // Hiển thị thông tin danh mục
    const fetchCategories = async() => {
      const response =await getAllCategory();
      if(response.success) setCategories(response.data || []);
    }
    // Hiển thị thông tin tồn kho
    const fetchInventories = async () => {
      const response = await getAllInventory();
      if(response.success) setInventories(response.data || []);
    }
    useEffect(() => {
        fetchSpecification();
        fetchCategories();
        fetchInventories();
    },[]);
   
    // Xử lý khi phóng to ảnh
    const [showZoom, setShowZoom] = useState<boolean>(false);
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    //  Hiển thị thông tin sản phẩm
    useEffect(() => {
        const fetchProductBySlug = async() => {
            const response = await GetProductBySlug(slug);
            if(response.success) {
                setProductSlug(response.data);
                // Set ảnh mặc định khi load được data
                if(response.data?.thumb?.url) {
                    setSelectedImage(response.data.thumb.url);
                }
            }
        }
        fetchProductBySlug();
    },[slug]);

    const handleQuantity = useCallback((value: string) => {
        if (value === '') {
            setQty(0); 
            return;
        }
        const num = Number(value);
        if (!isNaN(num) && num >= 1 && num <= 999) {
            setQty(num);
        }
    }, []);

    const handleChangeQuantity = useCallback((flag: string) => {
        const currentQty = typeof qty === 'string' ? 
            (qty === '' ? 1 : Number(qty)) : qty;
        
        if (flag === 'minus' && currentQty > 1) {
            setQty(currentQty - 1);
        } else if (flag === 'plus' && currentQty < 999) {
            setQty(currentQty + 1);
        }
    }, [qty]);


    const handleAddToCart = () => {
        const existingProductInventory = inventories.find(el => el.productId === productSlug?._id)
        console.log(existingProductInventory);
        if(existingProductInventory && Number(existingProductInventory.currentStock) < 50){
            toast.error('Số lượng sản phẩm hiện quá thấp. Mong quý khách thông cảm vì sự bất tiện này.');
            return;
        }
        if(qty ===  0){
            toast.error('Vui lòng chọn số lượng phù hợp');
            return;
        }
        if(existingProductInventory && Number(existingProductInventory.currentStock) < qty){
            toast.error(`Số lượng sản phẩm bạn đặt lớn hơn số lượng sản phẩm trong kho - Kho: ${existingProductInventory.currentStock} sản phẩm. Vui lòng chọn lại số lượng phù hợp`);
            return;
        }
        dispatch(addToCart({
            pid: productSlug?._id || '',
            price: productSlug?.price_reference || 0,
            name: productSlug?.name_vn || '',
            quantity: qty,
            thumb: productSlug?.thumb.url || ''
        }));
        toast.success(`Thêm ${qty} sản phẩm vào giỏ hàng`)
    };
    const handleBuyNow = () => {
        const existingProductInventory = inventories.find(el => el.productId === productSlug?._id)
        if(existingProductInventory && Number(existingProductInventory.currentStock) < 50){
            toast.error('Số lượng sản phẩm hiện quá thấp. Mong quý khách thông cảm vì sự bất tiện này.');
            return;
        }
        if(qty >  200){
            toast.error('Để đặt số lượng lớn quý khách vui lòng liên hệ về Công ty để trao đổi');
            return;
        }
        if(qty ===  0){
            toast.error('Vui lòng chọn số lượng phù hợp');
            return;
        }
        if(existingProductInventory && Number(existingProductInventory.currentStock) < qty){
            toast.error(`Số lượng sản phẩm bạn đặt lớn hơn số lượng sản phẩm trong kho - Kho: ${existingProductInventory.currentStock} sản phẩm. Vui lòng chọn lại số lượng phù hợp`);
            return;
        }
        dispatch(addToCart({
            pid: productSlug?._id || '',
            price: productSlug?.price_reference || 0,
            name: productSlug?.name_vn || '',
            quantity: qty,
            thumb: productSlug?.thumb.url || ''
        }));
         dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
          setTimeout(() => {
              router.push('/cart');
              setTimeout(() => {
                  dispatch(hideModal())
              }, 500);
        }, 1000)
    }

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

    const handleImageSelect = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    // Kiểm tra nếu chưa có data thì không render
    if (!productSlug) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

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
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                fill
                                alt={productSlug.name_vn || 'Product image'}
                                style={{  }}
                                priority
                            />
                        )}
                    </Box>
                </Card>

                {/* Ô phóng to */}
                {showZoom && selectedImage && (
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
                <Box sx={{ display: 'flex', mt: 2, gap: 1, flexWrap: 'wrap' }}>
                    {/* Ảnh chính */}
                    {productSlug.thumb?.url && (
                        <Card
                            sx={{
                                width: 100, 
                                border: selectedImage === productSlug.thumb.url ? 
                                    `2px solid ${theme.palette.primary.dark}` : 
                                    `1px solid ${theme.palette.text.secondary}`,
                                cursor: 'pointer',
                                opacity: selectedImage === productSlug.thumb.url ? 1 : 0.7,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 1,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            onClick={() => handleImageSelect(productSlug.thumb.url)}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '5 / 4',
                                }}
                            >
                                <Image
                                    src={productSlug.thumb.url}
                                    fill
                                    alt={`${productSlug.name_vn} thumbnail`}
                                    style={{ objectFit: 'cover' }}
                                    sizes="100px"
                                />
                            </Box>
                        </Card>
                    )}
                    
                    {/* Các ảnh phụ (nếu có) */}
                    {productSlug?.images && productSlug?.images.map((image, index) => (
                        <Card
                            key={index}
                            sx={{
                                width: 100, 
                                border: selectedImage === image.url ? 
                                    `2px solid ${theme.palette.primary.dark}` : 
                                    `1px solid ${theme.palette.text.secondary}`,
                                cursor: 'pointer',
                                opacity: selectedImage === image.url ? 1 : 0.7,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 1,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            onClick={() => handleImageSelect(image.url)}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '5 / 4',
                                }}
                            >
                                <Image
                                    src={image.url}
                                    fill
                                    alt={`${productSlug.name_vn} image ${index + 1}`}
                                    style={{ objectFit: 'cover' }}
                                    sizes="100px"
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
                    {productSlug.name_vn}
                </Typography>

                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        py: 0.5
                    }}>
                    <Box 
                        sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 ,
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                            const rating = productSlug.totalRatings || 0;
                            
                            return (
                                <Box
                                key={star}
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    fontSize: '20px',
                                    lineHeight: 1
                                }}
                                >
                                <Box
                                    sx={{
                                    color: theme.palette.text.primary,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                    }}
                                >
                                    ★
                                </Box>
                                
                                <Box
                                    sx={{
                                    color: theme.palette.warning.main,
                                    overflow: 'hidden',
                                    width: rating >= star ? '100%' : 
                                            rating >= star - 0.5 ? '50%' : '0%',
                                    position: 'relative'
                                    }}
                                >
                                    ★
                                </Box>
                                </Box>
                            );
                            })}
                        </Box>
                    </Box>
                    <Typography variant='body1'>
                        ({productSlug.totalRatings}) 
                    </Typography>
                    <Typography variant='body1'>
                        - {productSlug.ratings?.length || 0} lượt đánh giá
                    </Typography>
                </Box>

                <Box sx={{py: 0.5}}>
                    <Typography variant='h6' sx={{ 
                        color: theme.palette.error.main,
                        fontWeight: 'bold'
                    }}>
                        {productSlug.price_reference?.toLocaleString()} VNĐ
                    </Typography>
                </Box>
                <Box sx={{py: 0.5}}>
                    <Typography variant='body1' color='text.primary' fontWeight='bold'>
                        Đơn Vị:
                    </Typography>
                    <Typography
                        sx={{
                            backgroundColor: theme.palette.primary.light,
                            width: '35%',
                            textAlign: 'center',
                            p: 1,
                            mt: 0.5,
                            borderRadius: 1,
                            color: theme.palette.text.secondary,
                            fontWeight: theme.typography.fontWeightMedium
                        }}
                    >
                        {productSlug.code} {specification.find(el => el._id === productSlug.specification)?.name}
                    </Typography>
                </Box>

                <Box sx={{py: 0.5,}}>
                    <Typography variant='body1' fontWeight='bold' marginBottom={0.5}>
                        Số lượng
                    </Typography>
                    <Quantity
                        quantity={qty}
                        handleChangeQuantity={handleChangeQuantity}
                        handleQuantity={handleQuantity}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 3, width: '100%' }}>
                    <Button
                        handleOnClick={handleBuyNow}
                        name='Mua ngay'
                    />
                    <Button
                        name='Thêm vào giỏ hàng'
                        handleOnClick={handleAddToCart}
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
                                    {categories.find(el => el._id === productSlug.category)?.name}
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
                                    {productSlug.code}
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
                                    {productSlug.sold} sản phẩm
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
                                    {inventories.find(el => el.productId === productSlug._id)?.currentStock} sản phẩm
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};