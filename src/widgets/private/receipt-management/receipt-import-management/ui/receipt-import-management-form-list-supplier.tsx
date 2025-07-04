import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { SupplierData } from '@/features/supplier/type/supplierType';
import { BANK_LIST } from '@/shared/constant/common';

export const ReceiptImportManagementFormListSupplier: React.FC<{ supplier: SupplierData }> = ({ supplier }) => {
  const theme = useTheme();

  const SupplierInfoRow: React.FC<{ label: string; value: string | undefined; icon?: React.ReactNode }> = ({ 
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
            <Typography sx={{color: theme.palette.text.secondary, textAlign:'center'}} variant='body2'>Thông tin nhà cung cấp</Typography>
        </Box>
        <Box sx={{ 
        mt: 1,
        '& > *:last-child': {
            borderBottom: 'none'
        }
        }}>
        
        <SupplierInfoRow label='Tên nhà cung cấp' value={supplier?.name} />
        <SupplierInfoRow label='Người liên hệ' value={supplier?.contact_person} />
        <SupplierInfoRow label='Số điện thoại' value={supplier?.phone} />
        <SupplierInfoRow label='Email' value={supplier?.email} />
        <SupplierInfoRow label='Địa chỉ' value={supplier?.address?.detail} />
        <SupplierInfoRow label='Mã số thuế' value={supplier?.tax_code as string} />
        <SupplierInfoRow label='Trạng thái' value={supplier?.isActive as string} />
        <SupplierInfoRow label='Tên ngân hàng' value={BANK_LIST.find(el => el._id === supplier?.bank_account.bank_name as string)?.name} />
        <SupplierInfoRow label='Số tài khoản' value={supplier?.bank_account.account_number as string} />
        </Box>
    </>

  );
};