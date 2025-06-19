'use client'
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  NotificationsOutlined,
  MailOutline,
  Person,
  Settings,
  ExitToApp,
  DarkMode,
  Language,
} from '@mui/icons-material';
import { HEADER_HEIGHT } from '@/shared/constant/common';



export const Header = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

 
  // Xử lý sự kiện
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setAnchorEl(null);
  };
  const renderProfileMenu = (): React.ReactElement => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        sx: { width: 250, mt: 1.5 }
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
          Admin User
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          admin@company.com
        </Typography>
      </Box>
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <Person fontSize='small' />
        </ListItemIcon>
        <ListItemText>Hồ sơ cá nhân</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <Settings fontSize='small' />
        </ListItemIcon>
        <ListItemText>Cài đặt</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
            <DarkMode fontSize='small' />
        </ListItemIcon>
        <ListItemText>
            Chế độ tối
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <Language fontSize='small' />
        </ListItemIcon>
        <ListItemText>Ngôn ngữ</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <ExitToApp fontSize='small' />
        </ListItemIcon>
        <ListItemText>Đăng xuất</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar sx={{
        position: 'fixed',
        width: '100%',
        height: HEADER_HEIGHT,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.secondary,
        boxShadow: theme.shadows[1],
        borderBottom: `1px solid ${theme.palette.divider}`,
    }}>
      <Toolbar sx={{ minHeight: HEADER_HEIGHT, display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='error'>
              <MailOutline />
            </Badge>
          </IconButton>
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='error'>
              <NotificationsOutlined />
            </Badge>
          </IconButton>
          
          <IconButton
            edge='end'
            aria-label='account menu'
            onClick={handleProfileMenuOpen}
            color='inherit'
            sx={{ ml: 1 }}
          >
            <Settings sx={{ ml: 0.5 }} />
          </IconButton>
        </Box>

        {renderProfileMenu()}
      </Toolbar>
    </AppBar>
  );
};