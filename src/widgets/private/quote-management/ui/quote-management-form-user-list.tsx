import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { UserData } from '@/features/user/type/userTypes';
import { CustomerGender } from '@/shared/constant/common';
import moment from 'moment';

export const QuoteManagementFormUserList: React.FC<{ user: UserData }> = ({ user }) => {
  const theme = useTheme();

  const UserInfoRow: React.FC<{ label: string; value: string | undefined; icon?: React.ReactNode }> = ({ 
    label, 
    value, 
    icon 
  }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 2, 
      py: 2, 
      px: 1,
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: 1
      }
    }}>
      {icon && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
        }}>
          {icon}
        </Box>
      )}
      <Typography 
        variant='body1' 
        sx={{ 
          fontWeight: 600, 
          minWidth: '140px',
        }}
      >
        {label}:
      </Typography>
      <Typography 
        variant='body1' 
        sx={{ 
          flex: 1,
          wordBreak: 'break-word'
        }}
      >
        {value || <span style={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>Chưa cập nhật</span>}
      </Typography>
    </Box>
  );

  return (
    <>
        <Box
            sx={{backgroundColor: theme.palette.primary.main, py:2}}
        >
            <Typography sx={{color: theme.palette.text.secondary, textAlign:'center'}} variant='body2'>Thông tin khách hàng</Typography>
        </Box>
        <Box sx={{ 
        mt: 1,
        '& > *:last-child': {
            borderBottom: 'none'
        }
        }}>
        
        <UserInfoRow label='Họ và tên' value={user?.name} />
        <UserInfoRow 
            label='Giới tính' 
            value={CustomerGender.find((el) => el._id === user?.gender)?.name} 
        />
        <UserInfoRow label='Số điện thoại' value={user?.phone} />
        <UserInfoRow label='Email' value={user?.email} />
        <UserInfoRow label='Địa chỉ' value={user?.address?.detail} />
        <UserInfoRow 
            label='Ngày sinh' 
            value={user?.dateOfBirth ? moment(user.dateOfBirth).format('DD/MM/YYYY') : undefined} 
        />
        <UserInfoRow label='Mã số thuế' value={user?.tax_code as string} />
        <UserInfoRow label='Thông tin xuất hóa đơn' value={user?.invoice_address as string} />
        </Box>
    </>

  );
};