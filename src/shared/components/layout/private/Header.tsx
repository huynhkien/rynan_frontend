'use client'
import React, { useEffect, useState } from 'react';
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
  MailOutline,
  Person,
  Settings,
  ExitToApp,
  Home,
  ContactEmergency,
} from '@mui/icons-material';
import { HEADER_HEIGHT } from '@/shared/constant/common';
import { ContactData } from '@/features/contact/type/contactType';
import { getAllContact } from '@/features/contact/api/contactApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { LinkTransition } from '../../ui/public/LinkTransition';
import { logoutUser } from '@/features/user/api/userApis';
import { toast } from 'react-toastify';
import { logout } from '@/features/user/store/userSlice';



export const Header = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contacts, setContacts] = useState<ContactData[] | []>([]);
  const {current} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  // Xử lý sự kiện
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // Xử lý logout
      const handleLogout = async() => {
        if(confirm('Bạn chắc có muốn đăng xuất khỏi hệ thống?')){
          const response = await logoutUser();
          if(response.success){
            toast.success(response.message);
            dispatch(logout());
            window.location.href = '/';
          }else{
            toast.error(response.message);
          }
        }
      }

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const renderProfileMenu = () => (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: { width: 250, mt: 1.5, backgroundColor: theme.palette.text.secondary },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            Admin User
          </Typography>
          <Typography variant='body1' color='text.primary'>
            {current?.email}
          </Typography>
        </Box>
        <MenuItem onClick={handleProfileMenuClose}>
          <LinkTransition href='/user' style={{textDecoration: 'none', color:theme.palette.text.primary}}>
            <Box sx={{display: 'flex'}}>
              <ListItemIcon>
                <Person fontSize='small' />
              </ListItemIcon>
              <ListItemText>Hồ sơ cá nhân</ListItemText>
            </Box>
          </LinkTransition>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <LinkTransition href='/' style={{textDecoration: 'none', color:theme.palette.text.primary}}>
            <Box sx={{display: 'flex'}}>
              <ListItemIcon>
                <Home fontSize='small' />
              </ListItemIcon>
              <ListItemText>Giao diện web</ListItemText>
            </Box>
          </LinkTransition>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <LinkTransition href='/admin/contact' style={{textDecoration: 'none', color:theme.palette.text.primary}}>
            <Box sx={{display: 'flex'}}>
              <ListItemIcon>
                <ContactEmergency fontSize='small' />
              </ListItemIcon>
              <ListItemText>Liên hệ</ListItemText>
            </Box>
          </LinkTransition>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize='small' />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    );
  // Xử lý số lượng tin liên hệ
  const fetchContacts = async() => {
    const response = await getAllContact();
    if(response.success) setContacts(response.data || []);
  }
  useEffect(() => {
    fetchContacts();
  },[]);
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
          {(current?.role === '2002' || '2004' || '2006') &&
          <IconButton color='inherit'>
            <LinkTransition href='/admin/contact-management' style={{color: theme.palette.text.secondary}}>
            <Badge badgeContent={contacts.filter(el => el.status === 'pending').length || 0} color='error'>
              <MailOutline />
            </Badge>
            </LinkTransition>
          </IconButton>
          }
          
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