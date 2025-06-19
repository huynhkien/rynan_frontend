'use client'

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Badge,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  BarChart,
  Help,
  ExitToApp,
  ChevronLeft,
  ChevronRight,
  Person,
  Category,
  Store,
  RequestQuote,
  CheckOutlined,
  Warehouse,
  Comment,
  ContactEmergency
} from '@mui/icons-material';
import Link from 'next/link';
import { COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '@/shared/constant/common';


// Types
interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/product' },
  { text: 'Danh mục', icon: <Category />, path: '/product' },
  { text: 'Sản phẩm', icon: <Store />, path: '/product' },
  { text: 'Thống kê', icon: <BarChart />, path: '/product' },
  { text: 'Liên hệ', icon: <ContactEmergency />, path: '/product' },
  { text: 'Bình luận', icon: <Comment />, path: '/product' },
  { text: 'Người dùng', icon: <Person />, path: '/product' },
  { text: 'Đơn hàng', icon: <CheckOutlined />, path: '/order' },
  { text: 'Kho hàng', icon: <Warehouse />, path: '/order' },
  { text: 'Báo giá', icon: <RequestQuote />, path: '/quote', badge: 5 },
];

const bottomItems: MenuItem[] = [
  { text: 'Trợ giúp', icon: <Help />, path: '/help' },
  { text: 'Đăng xuất', icon: <ExitToApp />, path: '/logout' },
];

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderHeader = (): React.ReactElement => (
    <Box sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: theme.palette.text.secondary,
      minHeight: 64,
    }}>
      {!isCollapsed && (
        <>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'inherit', 
              width: 32, 
              height: 32 
            }}
          >
            A
          </Avatar>
          <Typography 
            variant='h6' 
            sx={{ 
              fontWeight: theme.typography.fontWeightBold,
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            Admin Panel
          </Typography>
        </>
      )}
      <IconButton
        onClick={toggleSidebar}
        sx={{ 
          ml: isCollapsed ? 'auto' : 'auto',
          color: 'inherit',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
          }
        }}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </Box>
  );

  const renderUserInfo = (): React.ReactElement => (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isCollapsed ? 0 : 2,
        p: 2,
        bgcolor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        justifyContent: isCollapsed ? 'center' : 'flex-start',
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
          <Person />
        </Avatar>
        {!isCollapsed && (
          <Box>
            <Typography 
              variant='body1' 
              sx={{ fontWeight: theme.typography.fontWeightRegular }}
            >
              Admin
            </Typography>
            <Typography variant='body2' sx={{ opacity: 0.8 }}>
              Administrator
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  const renderMenuItem = (item: MenuItem, index: number): React.ReactElement => {
    const listItem = (
      <ListItem 
        key={index} 
        sx={{
          mb: 0.5,
          borderRadius: 2,
          mx: 1,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          px: isCollapsed ? 1 : 2,
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        <Link 
          href={item.path} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit', 
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <ListItemIcon sx={{ 
            color: 'inherit', 
            minWidth: isCollapsed ? 'auto' : 40,
            justifyContent: 'center'
          }}>
            {item.badge ? (
              <Badge badgeContent={item.badge} color='error'>
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: 500
              }}
            />
          )}
        </Link>
      </ListItem>
    );
    if (isCollapsed) {
      return (
        <Tooltip key={index} title={item.text} placement='right'>
          {listItem}
        </Tooltip>
      );
    }

    return listItem;
  };

  const renderMainMenu = (): React.ReactElement => (
    <List sx={{ px: 1, flex: 1 }}>
      {menuItems.map(renderMenuItem)}
    </List>
  );

  const renderBottomMenu = (): React.ReactElement => (
    <Box sx={{ mt: 'auto' }}>
      <Divider 
        sx={{ 
          borderColor: 'rgba(255,255,255,0.1)', 
          mx: 2, 
          mb: 1 
        }} 
      />
      <List sx={{ px: 1, pb: 2 }}>
        {bottomItems.map(renderMenuItem)}
      </List>
    </Box>
  );

  return (
    <Drawer 
      variant='permanent' 
      sx={{
        width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          background: theme.palette.primary.main,
          color: 'white',
          border: 'none',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        }
      }}
    >
      {renderHeader()}
      {renderUserInfo()}
      {renderMainMenu()}
      {renderBottomMenu()}
    </Drawer>
  );
};