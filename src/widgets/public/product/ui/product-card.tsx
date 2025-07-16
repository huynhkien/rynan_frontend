'use client'
import { Card, CardContent, Typography, Box, IconButton, Chip, useTheme } from '@mui/material';
import {  useCallback, useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product} from '@/features/product/type/productType';
import { useAppDispatch, useAppSelector} from '@/shared/hooks/useAppHook';
import { addToCart, updateFavorite } from '@/features/user/store/userSlice';
import { toast } from 'react-toastify';
import { Category, } from '@/features/category/type/categoryType';
import { getAllCategory } from '@/features/category/api/categoryApi';
import { InventoryData } from '@/features/inventory/type/inventoryType';
import { getAllInventory } from '@/features/inventory/api/inventoryApi';
import { LinkTransition } from '@/shared/components/ui/public/LinkTransition';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { addFavorite } from '@/features/user/api/userApis';


const ProductCard = ({ data }: { data: Product }) => {
  const router = useRouter();
  const theme = useTheme();
  const [hovering, setHovering] = useState(false);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [inventories, setInventories] = useState<InventoryData[] | []>([]);
  const {current} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  console.log(current);

  const handleProduct = () => {
    router.push(`/products/${data.slug}`)
  }
  // Hiển thị thông tin danh mục
   const fetchCategories = useCallback(async() => {
    const response = await getAllCategory();
    if(response.success) setCategories(response.data || []);
  }, []);
  const fetchInventories = useCallback(async () => {
    const response = await getAllInventory();
    if(response.success) setInventories(response.data || []);
  }, []);
  const refreshData = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchInventories()]);
  }, [fetchCategories, fetchInventories]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);
  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddCart = async () => {
    const existingProductInventory = inventories.find(el => el.productId === data._id)
    if(existingProductInventory && Number(existingProductInventory.currentStock) < 50){
      toast.error('Số lượng sản phẩm hiện quá thấp. Mong quý khách thông cảm vì sự bất tiện này.');
      return;
    }
    dispatch(addToCart({
      pid: data._id,
      price: data.price_reference,
      quantity: 1,
      thumb: data.thumb.url,
      name: data.name_vn
    }))
    toast.success('Thêm thành công sản phẩm vào giỏ hàng');
  }
  // Xử lý thêm sản phẩm vào danh sách yêu thích
  const handleAddFavorite = async() => {
    if(!current){
      Swal.fire({
        text: 'Vui lòng đăng nhập',
        icon: 'info',
        cancelButtonText: 'Không phải bây giờ',
        showCancelButton: true,
        confirmButtonText: 'Chuyển đến trang đăng nhập'
      }).then((rs: SweetAlertResult) => {
        if(rs.isConfirmed) router.push('/login')
      });
    } else{
      const response = await addFavorite(current._id, data._id);
      if(response.success){
        toast.success(response.message);
        dispatch(updateFavorite(data._id));
      }else{
        toast.error(response.message)
      }
    }
  }
  return (
    <Card
      sx={{ 
        width: {xs: '40%', md: '250px'}, 
        height: {xs: '310px', md: '400px'}, 
        borderRadius: '12px', 
        boxShadow: hovering ? 6 : 6,
        transition: 'all 0.3s ease',
        transform: hovering ? 'translateY(-5px)' : 'translateY(0)',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          onClick={handleProduct}
          sx={{
            position: 'relative', width: '100%', height: 'auto', aspectRatio: '5/4' ,
            transition: 'transform 0.3s ease',
            transform: hovering ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <Image
            fill
            src={data.thumb.url}
            alt={data.name_vn}/>
        </Box>
        {/* Giá */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: 2,
            backdropFilter: 'blur(10px)',
            fontSize: {xs: '12px', md: '14px'},
            color: theme.palette.primary.main 
          }}
        >
          {data.price_reference.toLocaleString()} VNĐ
        </Box>

        {/* Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: hovering ? 12 : -60,
            display: 'flex',
            flexDirection: 'column',
            opacity: hovering ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: hovering ? '0.1s' : '0s'
          }}
        >
          <IconButton 
            sx={{ 
              boxShadow: 5,
              '&:hover': { 
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
            onClick={handleAddFavorite}
          >
            <FavoriteIcon sx={{ color: current?.wishlist?.find(el => el === data._id) ? theme.palette.error.main: theme.palette.primary.light, fontSize: theme.typography.fontSize }} />
          </IconButton>
          <LinkTransition href={`/products/${data.slug}`}>
            <IconButton 
              sx={{ 
                boxShadow: 5,
                '&:hover': { 
                  backgroundColor: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease',
                transitionDelay: '0.05s'
              }}
            >
            
                  <VisibilityIcon sx={{ color: theme.palette.primary.light,  fontSize: theme.typography.fontSize }} />
            </IconButton>
          </LinkTransition>

          <IconButton 
            onClick={handleAddCart}
            sx={{ 
              boxShadow: 5,
              '&:hover': { 
                backgroundColor: 'white',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
              transitionDelay: '0.05s'
            }}
          >
            <ShoppingCartIcon sx={{ color: theme.palette.primary.light,  fontSize: theme.typography.fontSize }} />
          </IconButton>
        </Box>

        {/* Giảm giá(nếu có) */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#ff5722',
            color: theme.palette.text.secondary,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: {xs: '12px' , md: theme.typography.body1.fontSize},
            fontWeight: theme.typography.fontWeightBold
          }}
        >
          -20%
        </Box>
      </Box>
      {/* Thông tin */}
      <CardContent sx={{ p:1, height: '200px', display: 'flex', flexDirection: 'column' }}>
        <Typography 
          sx={{
            fontSize: {xs: '14px' , md: theme.typography.body1.fontSize},
          }}
        >
          {data.name_vn}
        </Typography>
        
        <Typography 
          sx={{
            fontSize: {xs: '12px' , md: theme.typography.body1.fontSize},
            my:1
          }}
        >
          {categories.find((el) => el._id === data.category)?.name}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt:1 }}>
          <Chip 
            label='913 đã bán' 
            size='small' 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.secondary,
              fontSize: {xs: `calc(${theme.typography.body1.fontSize} - 4px)`, md: `calc(${theme.typography.body1.fontSize} - 2px)`}
            }}
          />
        </Box>

        {/* Đánh giá */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 ,
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box
                key={star}
                sx={{
                  color: theme.palette.warning.main
                }}
              >
                ★
              </Box>
            ))}
          </Box>
          <Typography variant='body1'>
            (5.0)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
