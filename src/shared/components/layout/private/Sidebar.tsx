'use client'
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Box, Badge, Divider, useTheme, IconButton, Tooltip, Collapse} from '@mui/material';
import { Dashboard, BarChart, Help, ExitToApp, ChevronLeft, ChevronRight, Person, Category, Store, RequestQuote, CheckOutlined, Warehouse, Comment, ContactEmergency, ExpandLess, ExpandMore,  Inventory, ManageAccounts } from '@mui/icons-material';
import Link from 'next/link';
import { COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '@/shared/constant/common';


// Types
interface SubMenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  isCollapsed: boolean, 
  setIsCollapsed: (isCollapsed: boolean) => void
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Danh mục', icon: <Category />, path: '/admin/category-management' },
  { 
    text: 'Sản phẩm', 
    icon: <Store />, 
    path: '/',
    subItems: [
      { text: 'Quy cách đóng gói', icon: <Inventory />, path: '/admin/product-management/specification' },
      { text: 'Quản lý sản phẩm', icon: <ManageAccounts />, path: '/admin/product-management' },
    ]
  },
  { text: 'Người dùng', icon: <Person />, path: '/admin/user-management' },
  { text: 'Thống kê', icon: <BarChart />, path: '/admin' },
  { text: 'Liên hệ', icon: <ContactEmergency />, path: '/admin' },
  { text: 'Bình luận', icon: <Comment />, path: '/admin' },
  { text: 'Đơn hàng', icon: <CheckOutlined />, path: '/admin' },
  { text: 'Kho hàng', icon: <Warehouse />, path: '/admin' },
  { text: 'Báo giá', icon: <RequestQuote />, path: '/admin', badge: 5 },
];

const bottomItems: MenuItem[] = [
  { text: 'Trợ giúp', icon: <Help />, path: '/help' },
  { text: 'Đăng xuất', icon: <ExitToApp />, path: '/logout' },
];

export const Sidebar = ({isCollapsed, setIsCollapsed}: SidebarProps) => {
  const theme = useTheme();
  const [openSubMenus, setOpenSubMenus] = useState<{[key: string]: boolean}>({});

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubMenu = (itemText: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
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

  const renderSubMenuItem = (subItem: SubMenuItem, parentIndex: number, subIndex: number): React.ReactElement => {
    const key = `${parentIndex}-${subIndex}`;
    const listItem = (
      <ListItem 
        key={key}
        sx={{
          mb: 0.5,
          borderRadius: 2,
          mx: 1,
          ml: isCollapsed ? 1 : 3,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          px: isCollapsed ? 1 : 2,
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        <Link 
          href={subItem.path} 
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
            {subItem.icon}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText 
              primary={subItem.text} 
              primaryTypographyProps={{
                fontWeight: 400,
                fontSize: '0.875rem'
              }}
            />
          )}
        </Link>
      </ListItem>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={key} title={subItem.text} placement='right'>
          {listItem}
        </Tooltip>
      );
    }

    return listItem;
  };

  const renderMenuItem = (item: MenuItem, index: number): React.ReactElement => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSubMenuOpen = openSubMenus[item.text];

    const handleClick = (e: React.MouseEvent) => {
      if (hasSubItems && !isCollapsed) {
        e.preventDefault();
        toggleSubMenu(item.text);
      }
    };

    const listItem = (
      <ListItem 
        key={index} 
        onClick={handleClick}
        sx={{
          mb: 0.5,
          borderRadius: 2,
          mx: 1,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          px: isCollapsed ? 1 : 2,
          cursor: hasSubItems && !isCollapsed ? 'pointer' : 'default',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        {hasSubItems && !isCollapsed ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: 40,
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
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: 500
                }}
              />
            </Box>
            {isSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </Box>
        ) : (
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
        )}
      </ListItem>
    );

    const wrappedItem = isCollapsed ? (
      <Tooltip key={index} title={item.text} placement='right'>
        {listItem}
      </Tooltip>
    ) : listItem;

    return (
      <React.Fragment key={index}>
        {wrappedItem}
        {hasSubItems && !isCollapsed && (
          <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems!.map((subItem, subIndex) => 
                renderSubMenuItem(subItem, index, subIndex)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
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
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) rgba(255,255,255,0.05)',
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