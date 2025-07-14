'use client'
import { useRef, useEffect, useState, Fragment, useCallback } from 'react';
import { Box, Dialog, TextField, Typography, useTheme } from '@mui/material';
import { Cancel, Star, StarBorder } from '@mui/icons-material';
import theme from '@/shared/configs/theme';
import { Button } from '@/shared/components';
import { VoteStar } from '@/shared/constant/common';
import { ProductDetailRatingVoteProps } from '@/types/widgets/product';
import { Product, ProductRatingProps } from '@/features/product/type/productType';
import { addRating, GetProductBySlug } from '@/features/product/api/productApi';
import { useAppSelector } from '@/shared/hooks/useAppHook';
import { toast } from 'react-toastify';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { ProductDetailTabRatingOverview } from './product-detail-tab-rating-over-view';


// Hiển thị lượt đánh giá
const ProductDetailTabRatingVote = ({ number, ratingCount, ratingTotal } : ProductDetailRatingVoteProps) => {
    const theme = useTheme();
    const progressRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const percentage = ratingTotal > 0 ? (ratingCount / ratingTotal) * 100 : 0;
        if (progressRef.current) {
            progressRef.current.style.width = `${percentage}%`;
        }
    }, [ratingCount, ratingTotal]);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 1.5,
                gap: 2
            }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    minWidth: '60px',
                    gap: 0.5
                }}
            >
                <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
                    {number}
                </Typography>
                <Star 
                    sx={{ 
                        color: theme.palette.warning.main,
                        fontSize: theme.typography.fontSize
                    }} 
                />
            </Box>
            <Box 
                sx={{ 
                    flexGrow: 1,
                    position: 'relative',
                    height: '8px',
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                <Box
                    ref={progressRef}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        backgroundColor: theme.palette.warning.main,
                        borderRadius: '4px',
                        transition: 'width 0.8s ease-in-out',
                        width: '0%'
                    }}
                />
            </Box>
            <Box sx={{ minWidth: '80px', textAlign: 'right' }}>
                <Typography variant='body1' color='text.primary'>
                    {`${ratingCount || 0} đánh giá`}
                </Typography>
            </Box>
        </Box>
    );
};
// Hiển thị ô đánh giá
const ProductDetailTabRatingComment = ({product, setIsShowTabComment, fetchProduct} : {product: Product, setIsShowTabComment: (isShowTabComment: boolean) => void, fetchProduct: () => void}) => {
    const [isChooseStar, setIsChooseStar] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const {current} = useAppSelector(state => state.user);
    const router = useRouter();
    // Đánh giá sản phẩm
    const handleAddRating = async() => {
        try{
            if(!product){
                toast.error('Không có thông tin về sản phẩm');
                return;
            }
            if(!current){
              return Swal.fire({
                 text: 'Vui lòng đăng nhập',
                 icon: 'info',
                 cancelButtonText: 'Không phải bây giờ',
                 showCancelButton: true,
                 confirmButtonText: 'Chuyển đến trang đăng nhập'
              }).then((rs: SweetAlertResult) => {
                 if(rs.isConfirmed) router.push('/login')
              });
            }
            const ratingData = {
                star: isChooseStar,
                comment: comment,
                pid: product._id,
                uid: current._id
            }
            const response = await addRating(ratingData as ProductRatingProps);
            if(response.success) toast.success(response.message); setIsShowTabComment(false); fetchProduct();
        }catch(error: unknown){
            const errorMessage = (error as Error).message || 'Xảy ra lỗi không xác định';
            toast.error(errorMessage);
        }
    }
    return (
        <Box
            sx={{
                px: { xs: 2, md: 5 },
                py: 4,
                maxWidth: '800px',
                margin: '0 auto',
                background: '#fafafa',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
        >
            {/* Header */}
            <Typography 
                variant='h5' 
                sx={{
                    textAlign: 'center', 
                    mb: 1,
                    fontWeight: 600,
                    color: theme.palette.primary.main
                }}
            >
                Đánh giá sản phẩm
            </Typography>
            <Typography 
                variant='body2' 
                sx={{
                    mb: 2,
                    fontWeight: 500,
                    color: theme.palette.text.primary
                }}
            >
                Bạn cảm thấy sản phẩm như thế nào?
            </Typography>

            {/* Star Rating */}
            <Box 
                sx={{
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 3,
                    justifyContent: 'center'
                }}
            >
                {VoteStar.map((el, index) => (
                    <Box 
                        key={index}
                        onClick={() => setIsChooseStar(el?.id)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: isChooseStar !== null && isChooseStar >= el.id 
                                ? theme.palette.primary.main 
                                : 'white',
                            color: isChooseStar !== null && isChooseStar >= el.id 
                                ? 'white' 
                                : theme.palette.text.primary,
                            minWidth: { xs: '60px', sm: '80px' },
                            flex: { xs: '0 0 calc(20% - 8px)', sm: '1' },
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            border: `2px solid ${theme.palette.primary.light}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                borderColor: theme.palette.primary.main,
                            }
                        }}
                    >
                        <StarBorder 
                            sx={{
                                fontSize: { xs: '20px', sm: '24px' },
                                color: isChooseStar !== null && isChooseStar >= el.id 
                                    ? theme.palette.warning.main 
                                    : theme.palette.text.primary,
                                mb: 0.5
                            }}
                        />
                        <Typography 
                            variant='caption' 
                            sx={{
                                fontSize: { xs: '10px', sm: '12px' },
                                textAlign: 'center',
                                lineHeight: 1.2,
                                fontWeight: 500
                            }}
                        >
                            {el?.text}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Typography 
                variant='body1' 
                sx={{
                    mb: 2,
                    fontWeight: 500,
                    color: theme.palette.text.primary
                }}
            >
                Chia sẻ trải nghiệm của bạn:
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ chi tiết về trải nghiệm của bạn với sản phẩm này..."
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                        }
                    }
                }}
            />
            <Typography 
                variant='caption' 
                sx={{
                    display: 'block',
                    textAlign: 'right',
                    color: theme.palette.text.primary,
                    mb: 2
                }}
            >
                {comment.length}/500 ký tự
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
                <Button name='Gửi đánh giá' handleOnClick={handleAddRating}/>
            </Box>
            {/* Helper text */}
            <Typography 
                variant='caption' 
                sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: theme.palette.text.primary,
                    mt: 2,
                    fontStyle: 'italic'
                }}
            >
                Đánh giá của bạn sẽ giúp những khách hàng khác có thêm thông tin hữu ích
            </Typography>
        </Box>
    );
};
export const ProductDetailTabRating = ({slug}: {slug: string}) => {
    const [isShowTabComment, setIsShowTabComment] = useState(false);
    const [productSlug, setProductSlug] = useState<Product | null>(null);
    const handleShowTabComment = () => {
        setIsShowTabComment(prev => !prev);
    }
    // Hiển thị thông tin chi tiết về sản phẩm
    const fetchProduct = useCallback(async() => {
        if(!slug) return;
        const response = await GetProductBySlug(slug);
        if(response.success) setProductSlug(response.data);
    },[slug])
    useEffect(() => {
        fetchProduct();
    },[fetchProduct])
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                <Box 
                    sx={{
                        width: '40%',
                        border: `1px solid ${theme.palette.primary.main}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px'
                    }}
                >
                    <Typography variant='h6'>
                        Khách hàng đánh giá
                    </Typography>
                    <Typography variant='h5' fontWeight='bold'>
                        4/5
                    </Typography>
                    <Typography variant='body1'>12 lượt đánh giá</Typography>
                </Box>
                <Box
                    sx={{
                        width: '60%',
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px',
                        px: 5
                    }}
                >
                    {Array(5).fill(0).map((el, index) => (
                        <ProductDetailTabRatingVote
                            key={index}
                            number={index + 1}
                            ratingTotal={5}
                            ratingCount={4}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{py:3, width: '100%'}}>
                <Button name='Đánh giá' handleOnClick={handleShowTabComment}/>
            </Box>
            <Box>
                <ProductDetailTabRatingOverview product={productSlug as Product}/>
            </Box>
            {isShowTabComment && (
                <Fragment>
                    <Dialog
                        open={isShowTabComment}
                        onClose={handleShowTabComment}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        PaperProps={{
                        style: {
                            width: '40%',
                            height: '50%',
                            maxWidth: '1000px',
                            position: 'relative',
                            backgroundColor: theme.palette.text.secondary
                        },
                        }}
                    >
                        <Typography onClick={handleShowTabComment} component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                        <ProductDetailTabRatingComment product={productSlug as Product} setIsShowTabComment={setIsShowTabComment} fetchProduct={fetchProduct}/>
                    </Dialog>
                </Fragment>
            )}
        </Box>
    )
}