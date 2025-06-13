'use client'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Badge,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  YouTube,
  LinkedIn,
  ShoppingCart,
  Person,
  Menu 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

export const Header = () => {
  const theme = useTheme();
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl" sx={{py:1}}>
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Image src='/logo/SMART-AGRICULTURE_LOGO_BRIGHT-MODE-01.png' alt='Logo' width={220} height={70}/>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ flexGrow: 1, display: {xs: 'none', md: 'flex'}, alignItems: 'center', justifyContent: 'center', gap: 3, color: theme.palette.primary.main }}>
              <Typography>Trang Chủ</Typography>
              <Typography>Sản Phẩm</Typography>
              <Typography>Giới Thiệu</Typography>
              <Typography>Liên Hệ</Typography>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                sx={{
                  display: {xs: 'none', md: 'flex'},
                  color: '#2d5016',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <Badge badgeContent={0} color="warning">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                sx={{
                  display: {xs: 'none', md: 'flex'},
                  color: '#2d5016',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <Badge badgeContent={0} color="warning">
                  <Person />
                </Badge>
              </IconButton>
              <IconButton
                sx={{
                  display: {xs: 'flex', md: 'none'},
                  color: '#2d5016',
                  backgroundColor: '#f5f5f5',
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
          bottom: -40,
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
            height: '50px', 
            objectFit: 'cover'
          }}
        />
      </Box>
    </Box>
  );
};


