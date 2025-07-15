'use client'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Badge,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Slide,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  YouTube,
  LinkedIn,
  ShoppingCart,
  Person,
  Menu, 
  Home,
  Logout,
  Search
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { useState, forwardRef, Ref } from 'react';
import { CartDrawerView } from '@/widgets/public/cart/view/cart-drawer-view';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { logout } from '@/features/user/store/userSlice';
import { TransitionProps } from '@mui/material/transitions';
import { useDebounce } from '@/shared/hooks/useDeounce';
import { useRouter } from 'next/navigation';
import { slugify } from '@/shared/validation/slug';
import { logoutUser } from '@/features/user/api/userApis';
import { toast } from 'react-toastify';

// Tạo Transition component cho slide từ trên xuống
const Transition = forwardRef<
  Ref<unknown>,
  TransitionProps & {
    children: React.ReactElement;
  }
>(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const Header = () => {
    const theme = useTheme();
    const [openCart, setOpenCart] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const {current} = useAppSelector((state) => state.user);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const router = useRouter();
    // Giảm số lần gọi khi nhập value search 
    const searchDebounce = useDebounce(searchValue, 500);
    console.log(searchDebounce);
    const handleCloseSearch = () => {
      setOpenSearch(prev => !prev);
      setSearchValue('');
    };
    // Xử lý search 
    const handleOpenSearch = () => {
      setOpenSearch(true);
    };
    // Xử lý giỏ hàng
    const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setOpenCart(true);
    };
    // Xử lý logout
    const handleLogout = async() => {
      if(confirm('Bạn chắc có muốn đăng xuất khỏi hệ thống?')){
        const response = await logoutUser();
        if(response.success){
          toast.success(response.message);
          dispatch(logout());
        }else{
          toast.error(response.message);
        }
      }
    }
    // Xử lý 
    const handleSearch = () => {
      const keyword = searchDebounce.trim();
        if (keyword) {
          const slug = slugify(keyword);
          router.push(`/search/${slug}?q=${encodeURIComponent(keyword)}`);
          setSearchValue('');
          setOpenSearch(false);
        }
  }

return (
    <Box sx={{position: 'relative'}}>
      <AppBar 
        position="relative" 
        sx={{ 
          backgroundColor: theme.palette.primary.main,
          boxShadow: 'none'
        }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: '50px !important', py: 1 }}>
            <Box sx={{ display: {xs: 'none', md: 'flex'}, alignItems: 'center', flexGrow: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: theme.typography.fontWeightLight
                }}
              >
                Chào mừng bạn đến với Rynan Smart Agriculture
              </Typography>
            </Box>
            
            <Box sx={{position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    }
                  }}
                >
                  <Facebook sx={{ fontSize: theme.typography.fontSize }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    }
                  }}
                >
                  <Twitter sx={{ fontSize: theme.typography.fontSize }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    }
                  }}
                >
                  <YouTube sx={{ fontSize: theme.typography.fontSize }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    }
                  }}
                >
                  <LinkedIn sx={{ fontSize: theme.typography.fontSize }} />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: theme.palette.text.secondary,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
          py: 2,
        }}
      >
        <Container maxWidth="xl" sx={{py:1}}>
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, zIndex:10 }}>
              <Image src='/logo/SMART-AGRICULTURE_LOGO_BRIGHT-MODE-01.png' alt='Logo' width={300} height={80}/>
            </Box>

            {/* Thanh menu */}
            <Box sx={{ flexGrow: 1, display: {xs: 'none', md: 'flex'}, alignItems: 'center', justifyContent: 'center', gap: 3, color: theme.palette.primary.main }}>
              <Link href='/' style={{textDecoration: 'none', color: theme.palette.primary.main}}>Trang Chủ</Link>
              <Link href='/products' style={{textDecoration: 'none', color: theme.palette.primary.main}}>Sản Phẩm</Link>
              <Link href='/about' style={{textDecoration: 'none', color: theme.palette.primary.main}}>Giới Thiệu</Link>
              <Link href='/contact' style={{textDecoration: 'none', color: theme.palette.primary.main}}>Liên Hệ</Link>
            </Box>

            {/* Thanh icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                sx={{
                  display: {xs: 'none', md: 'flex'},
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  width: '40px',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light
                  }
                }}
                onClick={handleCartClick}
              >
                <ShoppingCart sx={{fontSize: 'body2.fontSize'}} />
              </IconButton>
              <IconButton
                  sx={{
                    display: {xs: 'none', md: 'flex'},
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.secondary,
                    width: '40px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light
                    }
                  }}
                  onClick={handleOpenSearch}
                >
                    <Search sx={{fontSize: 'body2.fontSize'}}/>
                </IconButton>
              {!current &&
              <IconButton
                sx={{
                  display: {xs: 'none', md: 'flex'},
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  width: '40px',
                    height: '40px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light
                  }
                }}
              >
                  <Link href='/login'
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Person sx={{fontSize: 'body2.fontSize'}}/>
                  </Link>  
              </IconButton>
              
              }
              {current &&
              <>
                <IconButton
                  sx={{
                    display: {xs: 'none', md: 'flex'},
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.secondary,
                    width: '40px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light
                    }
                  }}
                >
                  <Link href='/user'
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.text.secondary,
                      padding:0,
                      margin: 0
                    }}
                  >
                    <Home sx={{fontSize: 'body2.fontSize'}}/>
                  </Link>
                </IconButton>
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    display: {xs: 'none', md: 'flex'},
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.secondary,
                    width: '40px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light
                    }
                  }}
                >
                    <Logout sx={{fontSize: 'body2.fontSize'}}/>
                </IconButton>
                
              </>
              }
              <IconButton
                sx={{
                  display: {xs: 'flex', md: 'none'},
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  width: '40px',
                    height: '40px',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <Badge badgeContent={0} color="warning">
                  <Menu />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          position: 'absolute',
          bottom: -12,
          width: '100%',
          zIndex: 5
        }}
      >
        <Image
          src='/shape/page-title-top.png'
          alt='page-title-top'
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: '100%',
            height: '60px', 
            objectFit: 'cover'
          }}
        />
      </Box>
      {/* Hiển thị cart drawer */}
      <CartDrawerView
        open={openCart}
        setOpen={setOpenCart}
      />
      {/* Hiển thị thanh tìm kiếm */}
      <Dialog
        open={openSearch}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSearch}
        aria-describedby="search-dialog-description"
        PaperProps={{
          sx: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            margin: 0,
            maxWidth: '100%',
            width: '100%',
            borderRadius: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: theme.palette.primary.main
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <DialogContent sx={{ py: 3, px: 4 }}>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                py: 1,
              },
              backgroundColor: theme.palette.text.secondary,
              borderRadius: '5px'
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button sx={{backgroundColor: theme.palette.text.secondary, color:theme.palette.text.primary }} onClick={handleCloseSearch} variant="outlined">
            Hủy
          </Button>
          <Button  sx={{backgroundColor: theme.palette.text.secondary, color:theme.palette.text.primary }} onClick={handleSearch} variant="contained">
            Tìm kiếm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};