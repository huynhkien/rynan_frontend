'use client'
import { InvalidFieldProps } from '@/types/widgets/contact';
import { Email } from '@mui/icons-material';
import { Box, Container, Typography, useTheme, Divider} from '@mui/material'
import { useState } from 'react';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Button } from '@/shared/components';
import { BaseInput } from '@/shared/components/ui/public/BaseInput';
import { useAppDispatch } from '@/shared/hooks/useAppHook';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { forgotPassword } from '@/features/user/api/userApis';
import { showModal } from '@/shared/store/appSlice';

export const ForgotPasswordForm = () => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('');
    const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([]);

    const handleForgotPassword = async () => {
        setInValidFields([]);
        if (!email) {
            setInValidFields([{ name: 'email', message: 'Email là bắt buộc' }]);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setInValidFields([{ name: 'email', message: 'Email không hợp lệ' }]);
            return;
        }
        try {
            dispatch(showModal({isShowModal: true, modalType: 'loading'}))
            const response = await forgotPassword(email);
            if(response.success){
                toast.success(response.message);
                dispatch(showModal({isShowModal: false, modalType: null}))
                setEmail('');
            }
            
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            toast.error(errorMessage);
            setInValidFields([{ name: 'email', message: 'Có lỗi xảy ra, vui lòng thử lại' }]);
        } 
    };

    const handleBackToLogin = () => {
        router.push('/login'); 
    };
    
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
                        Quên Mật Khẩu
                    </Typography>
                    
                    <Typography 
                        variant='body1' 
                        sx={{
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                            mb: 2
                        }}
                    >
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3, opacity: 0.3 }} />
                
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <BaseInput
                        iconClass={<Email sx={{ color: theme.palette.primary.main }} />}
                        value={email}
                        setValue={setEmail}
                        nameKey='email'
                        placeholder='Nhập email của bạn'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                        type='email'
                    />
                   
                    <Button 
                        handleOnClick={handleForgotPassword} 
                        name='Gửi yêu cầu đặt lại'
                    />
                </Box>
                
                <Box 
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Typography 
                        variant='body1' 
                        sx={{
                            color: theme.palette.primary.main,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: theme.palette.primary.dark
                            }
                        }}
                        onClick={handleBackToLogin}
                    >
                        Quay lại đăng nhập
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}