'use client'

import { createOrder, getAllOrder } from '@/features/order/api/orderApi'
import { OrderData } from '@/features/order/type/orderType'
import { removeAllCart } from '@/features/user/store/userSlice'
import { Button } from '@/shared/components'
import { BaseInput } from '@/shared/components/ui/public/BaseInput'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook'
import { CheckoutInfoProps } from '@/types/widgets/checkout'
import { InvalidFieldProps } from '@/types/widgets/contact'
import { Email, LocationCity, Person, Phone } from '@mui/icons-material'
import { Box, Container, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Swal, { SweetAlertResult } from 'sweetalert2'

export const CheckoutInfo = () => {
  const theme = useTheme();
  const router = useRouter();
  const { cart, current } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<OrderData[] | []>([]);
  const [payload, setPayload] = useState<CheckoutInfoProps>({
    name: '',
    email: '',
    phone: '',
    address: {
        province: '',
        district: '',
        ward: '',
        addressAdd: '',
    },
    note: ''
  });
  
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  
  // Hiển thị thông tin đơn hàng 
  useEffect(() => {
    const fetchOrders = async() => {
      const response = await getAllOrder();
      if(response.success) setOrders(response.data || []);
    }
    fetchOrders();
  },[]);

  // Tạo mã code tự động
  const generateUniqueCode = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2); // Lấy 2 số cuối của năm
    
    // Tìm số thứ tự cao nhất từ các đơn hàng hiện có
    const currentYearOrders = orders.filter(order => 
      order.code && order.code.startsWith(`RYNAN${yearSuffix}-`)
    );
    
    let maxNumber = 0;
    currentYearOrders.forEach(order => {
      const match = order.code.match(/RYNAN\d{2}-0*(\d+)$/);
      if (match) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    // Tạo mã mới với số thứ tự tiếp theo
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(3, '0'); 
    return `RYNAN${yearSuffix}-${paddedNumber}`;
  }, [orders]);

  // Xử lý thanh toán
  const handleCheckout = async() => {
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

    if (cart.length === 0) {
      return Swal.fire({
        text: 'Giỏ hàng trống',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

    try {
      // Tạo mã đơn hàng tự động
      const orderCode = generateUniqueCode();
      const orderData = {
        orderBy: current._id,
        products: cart,
        total: totalAmount,
        note: payload.note,
        status: 'Processing',
        code: orderCode,
        customerInfo: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address
        }
      };
      
      const response = await createOrder(orderData as OrderData);
      
      if (response.success) {
        dispatch(removeAllCart());
        Swal.fire({
          text: `Đặt hàng thành công! Mã đơn hàng: ${orderCode}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Có thể redirect về trang orders hoặc reset form
          router.push('/');
        });
      } else {
        Swal.fire({
          text: 'Đặt hàng thất bại. Vui lòng thử lại!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
      Swal.fire({
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  useEffect(() => {
      if(current){
          setPayload({
              name: current.name || '',
              email: current.email || '',
              phone: current.phone || '',
              address: {
                  province: current.address?.province?.name || '',
                  district: current.address?.district?.name || '',
                  ward: current.address?.ward?.name || '',
                  addressAdd: current.address?.addressAdd || '',
              },
              note: ''
          })
      }
  },[current]);

  const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([]);

  return (
    <Container maxWidth='xl'
      sx={{
          pt: 5,
          pb: 25,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          width: '100%'
      }}>
      <Box sx={{width: "60%"}}>
        <Box sx={{
            backgroundColor: theme.palette.primary.main,
            height: '59px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
          <Typography variant='body2'
            sx={{
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold
            }}
            >
                Thông tin khách hàng
          </Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                backgroundColor: theme.palette.background.paper,
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px'
            }}
        >
          <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
            }}
          >
            <BaseInput
                iconClass={<Person sx={{ color: theme.palette.primary.main }} />}
                value={payload.name || ''}
                setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                nameKey='name'
                placeholder='Tên khách hàng'
                invalidFields={invalidFields}
                setInValidFields={setInValidFields}
            />
            <BaseInput
                iconClass={<Email sx={{ color: theme.palette.primary.main }} />}
                value={payload.email || ''}
                setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                nameKey='email'
                placeholder='Email'
                invalidFields={invalidFields}
                setInValidFields={setInValidFields}
            />
          </Box>
            <Box>
               <BaseInput
                    iconClass={<Phone sx={{ color: theme.palette.primary.main }} />}
                    value={payload.phone || ''}
                    setValue={(value) => setPayload((prev) => ({ ...prev, phone: value }))}
                    nameKey='phone'
                    placeholder='Số điện thoại'
                    invalidFields={invalidFields}
                    setInValidFields={setInValidFields}
                /> 
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
               <BaseInput
                    iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                    value={payload.address.province || ''}
                    setValue={(value) => setPayload((prev) => ({ 
                        ...prev, 
                        address: { ...prev.address, province: value } 
                    }))}
                    nameKey='address.province'
                    placeholder='Tỉnh/Thành phố'
                    invalidFields={invalidFields}
                    setInValidFields={setInValidFields}
                /> 
                <BaseInput
                    iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                    value={payload.address.district || ''}
                    setValue={(value) => setPayload((prev) => ({ 
                        ...prev, 
                        address: { ...prev.address, district: value } 
                    }))}
                    nameKey='address.district'
                    placeholder='Huyện/Quận'
                    invalidFields={invalidFields}
                    setInValidFields={setInValidFields}
                /> 
            </Box>
            <Box
             sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
               <BaseInput
                    iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                    value={payload.address.ward || ''}
                    setValue={(value) => setPayload((prev) => ({ 
                        ...prev, 
                        address: { ...prev.address, ward: value } 
                    }))}
                    nameKey='address.ward'
                    placeholder='Phường/Xã'
                    invalidFields={invalidFields}
                    setInValidFields={setInValidFields}
                /> 
                <BaseInput
                    iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                    value={payload.address.addressAdd || ''}
                    setValue={(value) => setPayload((prev) => ({ 
                        ...prev, 
                        address: { ...prev.address, addressAdd: value } 
                    }))}
                    nameKey='address.addressAdd'
                    placeholder='Địa chỉ cụ thể'
                    invalidFields={invalidFields}
                    setInValidFields={setInValidFields}
                /> 
            </Box>
            <Box>
               <BaseInput
                    value={payload.note || ''}
                    setValue={(value) => setPayload((prev) => ({ ...prev, note: value }))}
                    nameKey='note'
                    multiline
                    rows={9}
                    placeholder='Ghi chú (nếu có)'
                    invalidFields={invalidFields}
                    setInValidFields={setInValidFields}
                /> 
            </Box>
        </Box>
      </Box>
      <Box sx={{ overflow: 'hidden', width: "40%" }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            height: '59px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: theme.typography.fontWeightBold
            }}
          >
            Hóa Đơn
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: theme.palette.background.paper }}>
          <Box
            sx={{
              height: '335px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.grey[100],
                borderRadius: '3px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: theme.palette.grey[600]
                }
              }
            }}
          >
            {cart.map((item, index) => (
              <Box
                key={index} 
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  position: 'relative',
                  '&:not(:last-child)::after': {
                    content: '""',
                    position: 'absolute',
                    width: 'calc(100% - 16px)',
                    left: '8px'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      mx: 'auto'
                    }}
                  >
                    <Image
                      fill
                      src={item.thumb || ''}
                      alt={item.name || ''}
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: theme.typography.fontWeightMedium,
                      mx: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px'
                    }}
                  >
                    {item.name || ''}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      mx: 3
                    }}
                  >
                    {item.quantity} x {(item.price || 0).toLocaleString()} VNĐ
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: theme.palette.primary.main
                  }}
                >
                  {(item.quantity * (item.price || 0)).toLocaleString()} VNĐ
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 2,
            borderTop: `1px solid ${theme.palette.grey[400]}`
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: theme.typography.fontWeightBold }}
          >
            Tổng:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.primary.main
            }}
          >
            {totalAmount.toLocaleString()} VNĐ
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 2,
            borderTop: `1px solid ${theme.palette.grey[400]}`
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: theme.typography.fontWeightBold }}
          >
            Hình thức thanh toán:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.primary.main
            }}
          >
            Tiền mặt 
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button 
            handleOnClick={handleCheckout}
            name='Thanh Toán'
          />
        </Box>
      </Box>
    </Container>
  )
}