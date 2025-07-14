'use client'
import { InvalidFieldProps } from '@/types/widgets/contact';
import { LoginFormProps } from '@/types/widgets/login';
import {  Lock, Email, Person, Phone, Password } from '@mui/icons-material';
import { Box, Container, Typography, useTheme, Divider} from '@mui/material'
import { useCallback, useEffect, useState } from 'react';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {  Button } from '@/shared/components';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { BaseInput } from '@/shared/components/ui/public/BaseInput';
import { validateFormLoginAndRegister } from '@/shared/validation/form';
import { checkMail, getAllUser, loginUser,  registerUser } from '@/features/user/api/userApis';
import { useAppDispatch } from '@/shared/hooks/useAppHook';
import { useRouter } from 'next/navigation';
import { login } from '@/features/user/store/userSlice';
import { UserData } from '@/features/user/type/userTypes';

export const LoginForm = () => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<UserData[] | []>([]);
    // Hiển thị thông tin người dùng
    useEffect(() => {
        const fetchUsers = async() => {
            const response = await getAllUser();
            if(response.success) setUsers(response.data);
        }
        fetchUsers();
    },[]);
    // Tạo mã code tự động
    const generateUniqueCode = useCallback(() => {
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2); // Lấy 2 số cuối của năm
        
        // Tìm số thứ tự cao nhất từ các đơn hàng hiện có
        const currentYearUsers = users.filter(user => 
        user.code && user.code.startsWith(`RYNAN${yearSuffix}-U`)
        );
        
        let maxNumber = 0;
        currentYearUsers.forEach(user => {
        const match = (user.code as string).match(/RYNAN\d{2}-0*(\d+)$/);
        if (match) {
            const number = parseInt(match[1]);
            if (number > maxNumber) {
            maxNumber = number;
            }
        }
        });
        // Tạo mã mới với số thứ tự tiếp theo
        const nextNumber = maxNumber + 1;
        const paddedNumber = nextNumber.toString().padStart(3, '0'); 
        return `RYNAN${yearSuffix}-U${paddedNumber}`;
    }, [users]);
    const [payload, setPayload] = useState<LoginFormProps>({
        email: '',
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        code: generateUniqueCode(),
    });
    const resetPayload = () => {
        setPayload({
            email:'',
            name: '',
            phone: '',
            password: '',
            confirmPassword: '',
            code: '',
        })
    }
    const [isRegister, setIsRegister] = useState(false);
    const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([])
    const handleRegisterAndLogin = useCallback(async() => {
        const invalids = validateFormLoginAndRegister(payload, isRegister, setInValidFields);
        if(invalids.length > 0) return;
        try{
            if(isRegister){
                const existingMail = await checkMail(payload.email);
                if(!existingMail.success){
                    Swal.fire('Thất bại', existingMail.message, 'error').then(() => {
                        resetPayload();
                    });
                    return;
                }
                const response = await registerUser(payload);
                if(response.success) {
                    Swal.fire('Chúc mừng', response.message, 'success').then(() => {
                        setIsRegister(false);
                        resetPayload();
                    });
                }else{
                    Swal.fire('Thất bại', response.message, 'error').then(() => {
                        resetPayload();
                    });
                }
            }else{
                const response = await loginUser({email: payload.email, password: payload.password});
                if(response.success) {
                    dispatch(login({ isLogin: true, token: response.accessToken || '', userData: response.data }));
                    if(response.data.role === '2006'){
                        router.push('/admin');
                    }else{
                        router.push('/login')
                    }
                    resetPayload();
                }
            }
        }catch(error: unknown){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            Swal.fire('Thất bại', errorMessage, 'error');
            // resetPayload();
        }
        setTimeout(() => setInValidFields([]), 3000);
    }, [isRegister, payload, router, dispatch]);
    
    return (
        <Container
            sx={{
                display: 'flex',
                minHeight: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.secondary.light}22)`,
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', sm: '450px', md: '500px' },
                    maxWidth: '500px',
                    backdropFilter: 'blur(10px)',
                    background: theme.palette.text.secondary,
                    p: { xs: 3, sm: 4, md: 4 },
                    borderRadius: '10px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: isRegister ? 2 : 4
                }}>
                    <Box sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        p: 2,
                        borderRadius: '50%',
                        mb: 2,
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                    }}>
                        <HowToRegIcon sx={{
                            color: theme.palette.text.secondary,
                            width: 32,
                            height: 32
                        }}/>
                    </Box>
                    
                    <Typography 
                        variant='h5' 
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                            mb: 1,
                            textAlign: 'center'
                        }}
                    >
                        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                    </Typography>
                </Box>

                <Divider sx={{ mb: isRegister ? 0 : 3, opacity: 0.3 }} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isRegister ? 2 : 3
                }}>
                    {isRegister && (
                        <BaseInput
                            iconClass={<Person sx={{ color: theme.palette.primary.main }} />}
                            value={payload.name || ''}
                            setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                            nameKey='name'
                            placeholder='Nhập tên của bạn'
                            invalidFields={invalidFields}
                            setInValidFields={setInValidFields}
                        />
                    )}
                    <BaseInput
                        iconClass={<Email sx={{ color: theme.palette.primary.main }} />}
                        value={payload.email || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey='email'
                        placeholder='Nhập email của bạn'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    {isRegister && (
                        <BaseInput
                            iconClass={<Phone sx={{ color: theme.palette.primary.main }} />}
                            value={payload.phone || ''}
                            setValue={(value) => setPayload((prev) => ({ ...prev, phone: value }))}
                            nameKey='phone'
                            placeholder='Nhập số điện thoại của bạn'
                            invalidFields={invalidFields}
                            setInValidFields={setInValidFields}
                        />
                    )}
                    
                    <BaseInput
                        iconClass={<Lock sx={{ color: theme.palette.primary.main }} />}
                        value={payload.password || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, password: value }))}
                        nameKey='password'
                        type='password'
                        placeholder='Nhập mật khẩu'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    {isRegister && (
                        <BaseInput
                            iconClass={<Password sx={{ color: theme.palette.primary.main }} />}
                            value={payload.confirmPassword || ''}
                            type='password'
                            setValue={(value) => setPayload((prev) => ({ ...prev, confirmPassword: value }))}
                            nameKey='confirmPassword'
                            placeholder='Vui lòng nhập lại mật khẩu'
                            invalidFields={invalidFields}
                            setInValidFields={setInValidFields}
                        />
                    )}
                    
                    <Button handleOnClick={handleRegisterAndLogin} name='Đăng nhập'/>
                </Box>
                <Box 
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                    onClick = {() => setIsRegister(prev => !prev)}
                >
                    <Typography 
                        variant='body1' 
                        sx={{
                            color: theme.palette.text.primary,
                            cursor: 'pointer'
                        }}
                    >
                        {isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}
                    </Typography>
                    <Link href='/'
                        style={{
                            textDecoration: 'none',
                            color: theme.palette.text.primary
                        }}
                    >
                        Quên mật khẩu?
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}