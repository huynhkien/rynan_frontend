'use client';

import { Fragment, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Divider, 
  Avatar, 
  Chip, 
  IconButton, 
  Stack, 
  Button,
  TextField,
  Collapse
} from '@mui/material';
import theme from '@/shared/configs/theme';
import { Product, ProductReplyProps } from '@/features/product/type/productType';
import moment from 'moment';
import { UserData } from '@/features/user/type/userTypes';
import { getAllUser } from '@/features/user/api/userApis';
import { OrderData } from '@/features/order/type/orderType';
import { getAllOrder } from '@/features/order/api/orderApi';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/shared/hooks/useAppHook';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { addReply } from '@/features/product/api/productApi';

export const ProductDetailTabRatingOverview = ({ product }: { product: Product }) => {
  const [users, setUsers] = useState<UserData[] | []>([]);
  const [orders, setOrders] = useState<OrderData[] | []>([]);
  const router = useRouter();
  const {current} = useAppSelector(state => state.user);
  const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>({});
  const [showReply, setShowReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUser();
      if (response.success) setUsers(response.data);
    };
    const fetchOrders = async () => {
      const response = await getAllOrder();
      if (response.success) setOrders(response.data || []);
    };
    fetchUsers();
    fetchOrders();
  }, []);

  // Tìm thông tin khách đã mua hàng
  const getUserPurchaseInfo = (userId: string, productId: string) => {
    const userOrders = orders.filter(order => 
      order.orderBy === userId && 
      order.products.some(product => product.pid === productId)
    );
    return {
      hasPurchased: userOrders.length > 0,
      orderCount: userOrders.length,
      latestOrder: userOrders.length > 0 ? userOrders[userOrders.length - 1] : null
    };
  };

  // Xử lý like review
  const handleLikeReview = (reviewId: string) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Xử lý hiển thị form phản hồi
  const handleToggleReply = (reviewId: string) => {
    setShowReply(prev => prev === reviewId ? null : reviewId);
    setReplyText('');
  };
  // Xử lý phản hồi tin nhắn
  const handleAddReply = async() => {
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
        const replyData = {
            replier: showReply,
            feedback: replyText,
            postedBy: current._id
        }
        console.log(replyData);
        console.log(product?._id);
        console.log(showReply);
        const response = await addReply(product._id, showReply as string, replyData as ProductReplyProps);
        if(response.success) toast.success(response.message);
    }catch(error: unknown){
        const errorMessage = (error as Error).message || 'Xảy ra lỗi không xác định';
        toast.error(errorMessage);
    }
  }
  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.secondary.dark, borderRadius: 3 }}>
      {/* Danh sách đánh giá */}
      <Box mt={4}>
        <Typography variant='h6' mb={3} fontWeight={600}>
          Đánh giá gần đây ({product?.ratings.length || 0})
        </Typography>
        {product?.ratings.length > 0 ? (
          product?.ratings.map((item, index) => {
            const user = users.find(el => el._id === item.postedBy);
            const purchaseInfo = getUserPurchaseInfo(item.postedBy, product._id);
            const reviewId = item._id || `review-${index}`;
            const isLiked = likedReviews[reviewId] || false;
            const isReplyOpen = showReply === reviewId;
            
            return (
              <Fragment key={reviewId}>
                <Box display='flex' gap={3} mb={3} alignItems='flex-start'>
                  <Avatar
                    src={user?.avatar?.url || '/logo/logo-user.jpg'}
                    alt={user?.name || 'User'}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box flex={1}>
                    <Box display='flex' alignItems='center' gap={1} mb={0.5}>
                      <Typography fontWeight={600}>
                        {user?.name || 'Người dùng ẩn danh'}
                      </Typography>
                      {purchaseInfo.hasPurchased && (
                        <Chip
                          label={`Đã mua hàng${purchaseInfo.orderCount > 1 ? ` (${purchaseInfo.orderCount} lần)` : ''}`}
                          size='small'
                          color='success'
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    <Box display='flex' alignItems='center' gap={2}>
                      <Rating value={item.star} readOnly size='small' />
                      <Typography variant='body1' color='text.primary'>
                        {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </Typography>
                    </Box>
                    <Typography variant='body1' mt={1.5} mb={1}>
                      {item.comment}
                    </Typography>
                    
                    {/* Phần like và comment */}
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Box display='flex' alignItems='center'>
                        <IconButton
                          size='small'
                          onClick={() => handleLikeReview(reviewId)}
                          sx={{ 
                            color: isLiked
                              ? theme.palette.primary.main 
                              : 'text.primary',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          {isLiked ? (
                            <ThumbUpAltIcon sx={{fontSize: theme.typography.body1.fontSize}} />
                          ) : (
                            <ThumbUpAltOutlinedIcon sx={{fontSize: theme.typography.body1.fontSize}} />
                          )}
                        </IconButton>
                        <Typography 
                          variant='body1' 
                          sx={{ 
                            color: isLiked 
                              ? theme.palette.primary.main 
                              : 'text.primary',
                            fontWeight: isLiked ? 600 : 400
                          }}
                        >
                          0
                        </Typography>
                      </Box>

                      <Box display='flex' alignItems='center'>
                        <IconButton
                          size='small'
                          onClick={() => handleToggleReply(reviewId)}
                          sx={{ 
                            color: isReplyOpen 
                              ? theme.palette.primary.main 
                              : 'text.primary',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          <ChatBubbleOutlineOutlinedIcon sx={{fontSize: theme.typography.body1.fontSize}} />
                        </IconButton>
                        <Typography 
                          variant='body1' 
                          sx={{ 
                            color: isReplyOpen
                              ? theme.palette.primary.main 
                              : 'text.primary',
                            fontWeight: isReplyOpen ? 600 : 400,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleToggleReply(reviewId)}
                        >
                          Phản hồi
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Form phản hồi */}
                    <Collapse in={isReplyOpen} timeout='auto' unmountOnExit>
                      <Box mt={2}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder='Viết phản hồi...'
                          variant='outlined'
                          size='small'
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                        <Stack direction='row' justifyContent='flex-end' spacing={1} mt={1}>
                          <Button
                            variant='outlined'
                            size='small'
                            onClick={() => handleToggleReply(reviewId)}
                            sx={{
                              textTransform: 'none',
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              }
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            variant='contained'
                            size='small'
                            disabled={!replyText.trim()}
                            onClick={handleAddReply}
                            sx={{
                              textTransform: 'none',
                              backgroundColor: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                              },
                              '&:disabled': {
                                backgroundColor: theme.palette.grey[300],
                              }
                            }}
                          >
                            Gửi
                          </Button>
                        </Stack>
                      </Box>
                    </Collapse>

                    {/* Phản hồi từ cửa hàng (nếu có) */}
                    {index === 0 && (
                      <Box
                        bgcolor={theme.palette.grey[100]}
                        p={2}
                        borderRadius={1}
                        borderLeft='3px solid'
                        borderColor='primary.main'
                        mt={2}
                      >
                        <Typography variant='body1' fontWeight={600} mb={0.5}>
                          Phản hồi từ cửa hàng
                        </Typography>
                        <Typography variant='body1'>
                          Cảm ơn bạn đã tin tưởng và ủng hộ sản phẩm của chúng tôi. Chúc bạn một ngày tốt lành!
                        </Typography>
                        <Typography variant='caption' color='text.primary' display='block' mt={1}>
                          {moment().format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {index < product.ratings.length - 1 && <Divider sx={{ my: 2 }} />}
              </Fragment>
            );
          })
        ) : (
          <Typography variant='body2' color='text.secondary'>
            Chưa có đánh giá
          </Typography>
        )}
      </Box>
    </Box>
  );
};