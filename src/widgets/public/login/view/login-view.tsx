import { Box } from "@mui/material"
import { LoginForm } from "../ui/login-form"
import { Breadcrumb } from "@/shared/components"

export const LoginView = () => {
    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '800px',
                    position: 'relative',
                    pb: 15,
                    '&::after': {
                        content:'""',
                        backgroundImage: 'url(/banner/banner-4.jpg)',
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        top: 0,
                        left: 0,
                        zIndex: -1
                    }
                }}
            >
                <Box
                    sx={{ml:25}}
                >
                    <Breadcrumb
                        breadcrumb={[{
                            name: 'Đăng Nhập',
                            url: '/login'
                        }]}
                    />
                </Box>
                <LoginForm/>
            </Box>
        </>
    )
}