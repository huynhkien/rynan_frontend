'use client'
import { useRef, useEffect, useState, Fragment } from 'react';
import { Box, Dialog, TextField, Typography, useTheme } from '@mui/material';
import { Cancel, Star, StarBorder } from '@mui/icons-material';
import { ProductDetailRatingVoteProps } from '@/types/widgets/productDetailRating';
import theme from '@/shared/configs/theme';
import { Button } from '@/shared/components';
import { VoteStar } from '@/shared/constant/vote-star';


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
const ProductDetailTabRatingComment = () => {
    const [isChooseStar, setIsChooseStar] = useState<number | null>(null);
    return (
        <Box
            sx={{
                px:5,
                py:3
            }}
        >
            <Typography variant='h6' sx={{textAlign: 'center', py: 1}}>Đánh giá</Typography>
            <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Viết bình luận của bạn ở đây..."
            />
            <Typography variant='body1' sx={{py:1}}>Bạn cảm thấy sản phẩm như thế nào?</Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between', textAlign: 'center', pb:1}}>
                {VoteStar.map((el, index) => (
                    <Box key={index}
                        onClick = {() => setIsChooseStar(el?.id)}
                        sx={{
                            textAlign: 'center',
                            background: theme.palette.primary.light,
                            width: '100%',
                            mx:1,
                            p:1,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                transition: '0.2s',
                            }
                        }}
                    >
                        <StarBorder sx={{
                            color: isChooseStar !== null && isChooseStar >= el.id ? theme.palette.warning.main: 'black',
                        }}/>
                        <Typography>{el?.text}</Typography>
                    </Box>
                ))}
            </Box>
            <Button name='Đánh giá'/>
        </Box>
    )
}
export const ProductDetailTabRating = () => {
    const [isShowTabComment, setIsShowTabComment] = useState(false);
    const handleShowTabComment = () => {
        setIsShowTabComment(prev => !prev);
    }
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
                            position: 'relative'
                        },
                        }}
                    >
                        <Typography onClick={handleShowTabComment} component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                        <ProductDetailTabRatingComment/>
                    </Dialog>
                </Fragment>
            )}
        </Box>
    )
}