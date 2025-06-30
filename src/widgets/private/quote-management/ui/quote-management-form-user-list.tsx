'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Box, useTheme, Typography } from '@mui/material';
import { UserData } from '@/features/user/type/userTypes';
import { getUserById } from '@/features/user/api/userApis';
import moment from 'moment';
import { CustomerGender } from '@/shared/constant/common';

export const QuoteManagementFormUserList = ({ userId }: { userId: string }) => {
  const theme = useTheme();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const response = await getUserById(userId);
      if (response.success) setUser(response.data || null);
      console.log(response.data);
    };
    fetchUser();
  }, [userId]);

  const UserInfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
      <Typography variant='body1' sx={{ fontWeight: 500, minWidth: '80px' }}>
        {label}:
      </Typography>
      <Typography variant='body1' sx={{ color: theme.palette.text.primary }}>
        {value || 'Chưa cập nhật'}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 0,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant='body2' sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin khách hàng
          </Typography>
          
          <UserInfoRow label='Họ và tên' value={user?.name} />
          <UserInfoRow label='Giới tính' value={CustomerGender.find((el) => el._id === user?.gender)?.name} />
          <UserInfoRow label='SĐT' value={user?.phone} />
          <UserInfoRow label='Email' value={user?.email} />
          <UserInfoRow label='Địa chỉ' value={user?.address?.detail} />
          <UserInfoRow label='Ngày sinh' value={moment(user?.dateOfBirth).format('DD/MM/YYYY')} />
        </Box>
      </Paper>
    </Box>
  );
};