'use client';

import { Fragment, useEffect, useState } from 'react';
import { Box, Typography, Rating, Divider, Avatar, Chip, IconButton, Stack } from '@mui/material';
import theme from '@/shared/configs/theme';
import { Product } from '@/features/product/type/productType';
import moment from 'moment';
import { UserData } from '@/features/user/type/userTypes';
import { getAllUser } from '@/features/user/api/userApis';
import { OrderData } from '@/features/order/type/orderType';
import { getAllOrder } from '@/features/order/api/orderApi';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

export const ProductDetailTabRatingOverview = ({ product }: { product: Product }) => {
  const [users, setUsers] = useState<UserData[] | []>([]);
  const [orders, setOrders] = useState<OrderData[] | []>([]);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [showReply, setShowReply] = useState<Record<string, boolean>>({});

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

  const handleLike = (reviewId: string) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleToggleReply = (reviewId: string) => {
    setShowReply(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.secondary.dark, borderRadius: 3 }}>
      {/* Danh sách đánh giá */}
      <Box mt={4}>
        <Typography variant="h6" mb={3} fontWeight={600}>
          Đánh giá gần đây ({product?.ratings.length || 0})
        </Typography>
        {product?.ratings.length > 0 ? (
          product?.ratings.map((item, index) => (
            <Fragment key={index}>
              <Box display="flex" gap={3} mb={3} alignItems="flex-start">
                <Avatar
                  src={users.find(el => el._id === item.postedBy)?.avatar?.url || '/logo/logo-user.jpg'}
                  alt={item.postedBy}
                  sx={{ width: 48, height: 48 }}
                />
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography fontWeight={600}>
                      {users.find(el => el._id === item.postedBy)?.name}
                    </Typography>
                    {orders.filter(el => el.orderBy === item.postedBy).map(r => r.products.filter(p => p.pid === product._id)) && (
                      <Chip
                        label="Đã mua hàng"
                        size="small"
                        color="success"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Rating value={item.star} readOnly size="small" />
                    <Typography variant="body1" color="text.primary">
                      {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" mt={1.5} mb={1}>
                    {item.comment}
                  </Typography>

                  {/* Action buttons */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => handleLike(item._id as string)}
                      sx={{ color: likedReviews[item._id as string] ? theme.palette.primary.main : 'inherit' }}
                    >
                      {likedReviews[item._id as string] ? (
                        <ThumbUpAltIcon fontSize="small" />
                      ) : (
                        <ThumbUpAltOutlinedIcon fontSize="small" />
                      )}
                      <Typography variant="body2" ml={0.5}>
                        {item.like?.length || 0}
                      </Typography>
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => handleToggleReply(item._id as string)}
                    >
                      <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                      <Typography variant="body2" ml={0.5}>
                        Phản hồi
                      </Typography>
                    </IconButton>
                  </Stack>

                  {showReply[item._id as string] && (
                    <Box mt={2}>
                      <textarea
                        placeholder="Viết phản hồi..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          padding: '10px',
                          borderRadius: '4px',
                          border: `1px solid ${theme.palette.divider}`,
                          resize: 'vertical'
                        }}
                      />
                      <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
                        <button
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: theme.palette.grey[300],
                            cursor: 'pointer'
                          }}
                          onClick={() => handleToggleReply(item.postedBy)}
                        >
                          Hủy
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          Gửi
                        </button>
                      </Stack>
                    </Box>
                  )}

                  {/* Phản hồi từ cửa hàng (nếu có) */}
                  {index === 0 && (
                    <Box
                      bgcolor={theme.palette.grey[100]}
                      p={2}
                      borderRadius={1}
                      borderLeft="3px solid"
                      borderColor="primary.main"
                      mt={2}
                    >
                      <Typography variant="body1" fontWeight={600} mb={0.5}>
                        Phản hồi từ cửa hàng
                      </Typography>
                      <Typography variant="body1">
                        Cảm ơn bạn đã tin tưởng và ủng hộ sản phẩm của chúng tôi. Chúc bạn một ngày tốt lành!
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        {moment().format('DD/MM/YYYY HH:mm:ss')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {index < product.ratings.length - 1 && <Divider sx={{ my: 2 }} />}
            </Fragment>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Chưa có đánh giá
          </Typography>
        )}
      </Box>
    </Box>
  );
};