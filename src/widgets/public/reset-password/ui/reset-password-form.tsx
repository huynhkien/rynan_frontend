'use client'
import { InvalidFieldProps } from '@/types/widgets/contact';
import { Email } from '@mui/icons-material';
import { Box, Container, Typography, useTheme, Divider} from '@mui/material'
import { useState } from 'react';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Button } from '@/shared/components';
import { BaseInput } from '@/shared/components/ui/public/BaseInput';
import { useAppDispatch } from '@/shared/hooks/useAppHook';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { resetPassword } from '@/features/user/api/userApis';
import { showModal } from '@/shared/store/appSlice';
import { LinkTransition } from '@/shared/components/ui/public/LinkTransition';
import Swal from 'sweetalert2';

export const ResetPasswordForm = () => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([]);
    const {token} = useParams();

    const handleForgotPassword = async () => {
        setInValidFields([]);
        if (!password) {
            setInValidFields([{ name: 'password', message: 'Vui lòng nhập password để thay đổi mật khẩu' }]);
            return;
        }
        if(!passwordConfirm){
            setInValidFields([{ name: 'passwordConfirm', message: 'Vui lòng nhập lại mật khẩu để xác nhận mật khẩu đã thay đổi' }]);
            return;
        }
        if (password.length < 8) {
            setInValidFields([{ name: 'password', message: 'Mật khẩu lớn hơn 8 ký tự' }]);
            return;
        }
        if(password !== passwordConfirm) {
            Swal.fire('Thất bại', ' Vui lòng nhập đúng mật khẩu', 'error');
            return;
        }
        try {
            dispatch(showModal({isShowModal: true, modalType: 'loading'}));
            const response = await resetPassword(password, token as string);
            if(response.success){
                toast.success(response.message);
                dispatch(showModal({isShowModal: false, modalType: null}));
                router.push('/login')
            }
            
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            toast.error(errorMessage);
            setInValidFields([{ name: 'email', message: 'Có lỗi xảy ra, vui lòng thử lại' }]);
        } 
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
                        Cập nhật mật khẩu
                    </Typography>
                    
                    <Typography 
                        variant='body1' 
                        sx={{
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                            mb: 2
                        }}
                    >
                        Nhập mật khẩu mới cho tài khoản của bạn
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
                        value={password}
                        setValue={setPassword}
                        nameKey='password'
                        placeholder='Nhập password của bạn'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                        type='password'
                    />
                    <BaseInput
                        iconClass={<Email sx={{ color: theme.palette.primary.main }} />}
                        value={passwordConfirm}
                        setValue={setPasswordConfirm}
                        nameKey='passwordConfirm'
                        placeholder='Xác nhận mật khẩu password của bạn'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                        type='password'
                    />
                   
                    <Button 
                        handleOnClick={handleForgotPassword} 
                        name='Tạo mật khẩu mới'
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
                    <LinkTransition href='/login'>
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
                        >
                        Quay lại đăng nhập
                        </Typography>
                    </LinkTransition>
                </Box>
            </Box>
        </Container>
    )
}