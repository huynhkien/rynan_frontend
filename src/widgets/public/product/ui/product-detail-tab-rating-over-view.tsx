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
import { Product, ProductRatingsRepliesData} from '@/features/product/type/productType';
import moment from 'moment';
import { UserData } from '@/features/user/type/userTypes';
import { getAllUser } from '@/features/user/api/userApis';
import { OrderData } from '@/features/order/type/orderType';
import { getAllOrder } from '@/features/order/api/orderApi';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/shared/hooks/useAppHook';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { addReply, addReplyChild } from '@/features/product/api/productApi';
import { ArrowForwardIos } from '@mui/icons-material';
import { INITIAL_DISPLAY_COUNT } from '@/shared/constant/common';

interface ProductReplyFormProps {
  reviewId: string;
  handleToggleReply: (id: string) => void;
  isReplyOpen: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  setIsReplier: (id: string) => void;
  postedBy: string;
  handleAddReply: () => void;
}

const ProductReplyForm = ({
  reviewId,
  handleToggleReply,
  isReplyOpen,
  replyText,
  setReplyText,
  setIsReplier,
  postedBy,
  handleAddReply
}: ProductReplyFormProps) => {
  return (
    <Box>
      <Stack direction='row' spacing={2} alignItems='center'>
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
            onClick={() => {
              handleToggleReply(reviewId); 
              setIsReplier(postedBy);
            }}
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
    </Box>
  );
};

export const ProductDetailTabRatingOverview = ({ product, fetchProduct }: { product: Product; fetchProduct: () => void; }) => {
  const [users, setUsers] = useState<UserData[] | []>([]);
  const [orders, setOrders] = useState<OrderData[] | []>([]);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const {current} = useAppSelector(state => state.user);
  const [showReply, setShowReply] = useState<string | null>(null);
  const [isReplier, setIsReplier] = useState<string | null>(null);
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
            replier: isReplier,
            feedBack: replyText,
            postedBy: current._id
        }
        const response = await addReply(product._id, showReply as string, replyData as ProductRatingsRepliesData);
        if(response.success) {
          toast.success(response.message);
          setReplyText('');
          setShowReply(null);
          fetchProduct();
        }
        console.log(replyData)
    }catch(error: unknown){
        const errorMessage = (error as Error).message || 'Xảy ra lỗi không xác định';
        toast.error(errorMessage);
    }
  };
  const handleAddReplyChild = async() => {
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
            replier: isReplier,
            feedBack: replyText,
            postedBy: current._id
        }
        const response = await addReplyChild(product._id, showReply as string, replyData as ProductRatingsRepliesData);
        if(response.success) {
          toast.success(response.message);
          setReplyText('');
          setShowReply(null);
          fetchProduct();
        }
        console.log(replyData)
    }catch(error: unknown){
        const errorMessage = (error as Error).message || 'Xảy ra lỗi không xác định';
        toast.error(errorMessage);
    }
  };

  // Lấy danh sách reviews để hiển thị
  const getDisplayedReviews = () => {
    if (!product?.ratings) return [];
    
    if (showMoreReviews || product.ratings.length <= INITIAL_DISPLAY_COUNT) {
      return product.ratings;
    }
    
    return product.ratings.slice(0, INITIAL_DISPLAY_COUNT);
  };

  // Lấy danh sách replies để hiển thị
  const getDisplayedReplies = (replies: ProductRatingsRepliesData[], reviewId: string) => {
    if (!replies || replies.length === 0) return [];
    
    const shouldShowMore = showMoreReplies[reviewId];
    
    if (shouldShowMore || replies.length <= INITIAL_DISPLAY_COUNT) {
      return replies;
    }
    
    return replies.slice(0, INITIAL_DISPLAY_COUNT);
  };

  // Xử lý toggle hiển thị replies
  const handleToggleReplies = (reviewId: string) => {
    setShowMoreReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const displayedReviews = getDisplayedReviews();
  const hasMoreReviews = Number(product?.ratings?.length) > INITIAL_DISPLAY_COUNT;

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.secondary.dark, borderRadius: 3 }}>
      {/* Danh sách đánh giá */}
      <Box mt={4}>
        <Typography variant='h6' mb={3} fontWeight={600}>
          Đánh giá gần đây ({product?.ratings?.length || 0})
        </Typography>
        {displayedReviews.length > 0 ? (
          <>
            {displayedReviews.map((item, index) => {
              const user = users.find(el => el._id === item.postedBy);
              const purchaseInfo = getUserPurchaseInfo(item.postedBy as string, product._id);
              const reviewId = item._id || `review-${index}`;
              const isReplyOpen = showReply === reviewId;
              const postedBy = item.postedBy;
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
                      <ProductReplyForm 
                        reviewId={reviewId} 
                        handleToggleReply ={handleToggleReply}
                        isReplyOpen ={isReplyOpen}
                        replyText ={replyText}
                        setReplyText = {setReplyText}
                        setIsReplier = {setIsReplier}
                        handleAddReply = {handleAddReply}
                        postedBy={postedBy as string}/>
                      
                      {/* Phản hồi từ cửa hàng (nếu có) */}
                      {Number(item?.replies?.length) > 0 && (
                        <>
                          {getDisplayedReplies((item?.replies as ProductRatingsRepliesData[]), reviewId).map((el) => {
                            const purchaseInfo = getUserPurchaseInfo(el.postedBy, product._id);
                            const reviewIdChild = el._id || `review-${index}`;
                            const isReplyOpen = showReply === reviewIdChild;
                            const postedBy = el.postedBy;
                            return (
                              <Box key={el._id}
                                bgcolor={theme.palette.grey[100]}
                                p={2}
                                borderRadius={1}
                                borderLeft='3px solid'
                                borderColor='primary.main'
                                mt={2}
                              >
                                <Box>
                                  <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                      <Typography variant='body1' fontWeight={600} mb={0.5} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                      {users.find(u => u._id === el.postedBy)?.name} 
                                      <ArrowForwardIos sx={{fontSize: theme.typography.body1.fontSize, mt:0.5}}/> 
                                      {users.find(u => u._id === el.replier)?.name}
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
                                    <Typography variant='caption' color='text.primary' display='block' mt={1}>
                                    {moment(el.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </Typography>
                                  </Box>
                                  <Typography variant='body1'>
                                    {el.feedBack}
                                  </Typography>
                                </Box>
                                <Box sx={{mt:1}}>
                                  <ProductReplyForm 
                                    reviewId={reviewIdChild} 
                                    handleToggleReply ={handleToggleReply}
                                    isReplyOpen ={isReplyOpen}
                                    replyText ={replyText}
                                    setReplyText = {setReplyText}
                                    setIsReplier = {setIsReplier}
                                    handleAddReply = {handleAddReplyChild}
                                    postedBy={postedBy}/>
                                </Box>
                              </Box>
                          )})
                          }
                          
                          {/* Nút Xem thêm/Ẩn bớt cho replies */}
                          {Number(item?.replies?.length) > INITIAL_DISPLAY_COUNT && (
                            <Box mt={2} display='flex' justifyContent='center'>
                              <Button
                                variant='text'
                                size='small'
                                onClick={() => handleToggleReplies(reviewId)}
                                sx={{
                                  textTransform: 'none',
                                  color: theme.palette.primary.main,
                                  fontSize: '0.875rem',
                                  '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                  }
                                }}
                              >
                                {showMoreReplies[reviewId] 
                                  ? 'Ẩn bớt phản hồi' 
                                  : `Xem thêm ${item.replies && item?.replies?.length - INITIAL_DISPLAY_COUNT} phản hồi`
                                }
                              </Button>
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>

                  {index < displayedReviews.length - 1 && <Divider sx={{ my: 2 }} />}
                </Fragment>
              );
            })}
            
            {/* Nút Xem thêm/Ẩn bớt */}
            {hasMoreReviews && (
              <Box mt={3} display='flex' justifyContent='center'>
                <Button
                  variant='outlined'
                  onClick={() => setShowMoreReviews(!showMoreReviews)}
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
                  {showMoreReviews ? 'Ẩn bớt' : `Xem thêm ${product.ratings && product.ratings.length - INITIAL_DISPLAY_COUNT} đánh giá`}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            Chưa có đánh giá
          </Typography>
        )}
      </Box>
    </Box>
  );
};