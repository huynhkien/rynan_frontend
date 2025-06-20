'use client'
import { InputForm } from '@/shared/components/ui/InputForm';
import { CheckoutInfoProps } from '@/types/widgets/checkout.types';
import { InvalidFieldProps } from '@/types/widgets/contact.types';
import { Email, LocationCity, Person, Phone } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material'
import { useState } from 'react';

export const CheckoutInfo = () => {
    const theme = useTheme();
    const [payload, setPayload] = useState<CheckoutInfoProps>({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            ward: '',
            city: '',
            country: '',
            district: '',
            zipCode: '',
        },
        message: ''
    });
    const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([])
    return (
        <Box>
            <Box sx={{
                backgroundColor: theme.palette.primary.main,
                height: '59px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant='body2'
                sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: theme.typography.fontWeightBold
                }}
                >
                    Thông tin khách hàng
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        mt:2
                    }}
                >
                    <InputForm
                        iconClass={<Person sx={{ color: theme.palette.primary.main }} />}
                        value={payload.name || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='email'
                        placeholder='Tên khách hàng'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    <InputForm
                        iconClass={<Email sx={{ color: theme.palette.primary.main }} />}
                        value={payload.email || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='email'
                        placeholder='Email'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                </Box>
                <Box>
                   <InputForm
                        iconClass={<Phone sx={{ color: theme.palette.primary.main }} />}
                        value={payload.phone || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='phone'
                        placeholder='Số điện thoại'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                   <InputForm
                        iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                        value={payload.address.city || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='address.country'
                        placeholder='Quốc gia'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                    <InputForm
                        iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                        value={payload.address.city || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='address.city'
                        placeholder='Thành phố'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                </Box>
                <Box
                 sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                   <InputForm
                        iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                        value={payload.address.district || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='address.district'
                        placeholder='Quận/Huyện'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                    <InputForm
                        iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                        value={payload.address.ward || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='address.ward'
                        placeholder='Phường/Xã'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                </Box>
                <Box>
                   <InputForm
                        iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                        value={payload.address.street || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='address.street'
                        placeholder='Địa chỉ cụ thể'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                </Box>
                <Box>
                   <InputForm
                        iconClass={<LocationCity sx={{ color: theme.palette.primary.main }} />}
                        value={payload.address.zipCode || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='address.zipCode'
                        placeholder='Mã ZipCode'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                </Box>
                <Box>
                   <InputForm
                        value={payload.message || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='message'
                        multiline
                        rows={10}
                        placeholder='Ghi chú (nếu có)'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    /> 
                </Box>
            </Box>
        </Box>
    )
}