'use client'
import { InputForm } from "@/shared/components/ui/InputForm"
import { InvalidFieldProps } from "@/types/widgets/contact.types";
import { LoginFormProps } from "@/types/widgets/login.types";
import {  Lock, Email, Person, Phone, Password } from "@mui/icons-material";
import { Box, Container, Typography, useTheme, Divider} from "@mui/material"
import { useState } from "react";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {  Button } from "@/shared/components";
import Link from "next/link";

export const LoginForm = () => {
    const theme = useTheme();
    const [payload, setPayload] = useState<LoginFormProps>({
        email: '',
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [isRegister, setIsRegister] = useState(false);
    const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([])
    
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
                        <InputForm
                            iconClass={<Person sx={{ color: theme.palette.primary.main }} />}
                            value={payload.name || ''}
                            setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                            nameKey="email"
                            placeholder="Nhập tên của bạn"
                            invalidFields={invalidFields}
                            setInValidFields={setInValidFields}
                        />
                    )}
                    <InputForm
                        iconClass={<Email sx={{ color: theme.palette.primary.main }} />}
                        value={payload.email || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                        nameKey="email"
                        placeholder="Nhập email của bạn"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    {isRegister && (
                        <InputForm
                            iconClass={<Phone sx={{ color: theme.palette.primary.main }} />}
                            value={payload.phone || ''}
                            setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                            nameKey="phone"
                            placeholder="Nhập số điện thoại của bạn"
                            invalidFields={invalidFields}
                            setInValidFields={setInValidFields}
                        />
                    )}
                    
                    <InputForm
                        iconClass={<Lock sx={{ color: theme.palette.primary.main }} />}
                        value={payload.password || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, password: value }))}
                        nameKey="password"
                        placeholder="Nhập mật khẩu"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    {isRegister && (
                        <InputForm
                            iconClass={<Password sx={{ color: theme.palette.primary.main }} />}
                            value={payload.confirmPassword || ''}
                            setValue={(value) => setPayload((prev) => ({ ...prev, email: value }))}
                            nameKey="confirmPassword"
                            placeholder="Vui lòng nhập lại mật khẩu"
                            invalidFields={invalidFields}
                            setInValidFields={setInValidFields}
                        />
                    )}
                    
                    <Button name='Đăng nhập'/>
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