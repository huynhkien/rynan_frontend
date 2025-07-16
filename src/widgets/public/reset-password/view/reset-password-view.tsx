import { Box } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { ResetPasswordForm } from "../ui/reset-password-form"

export const ResetPasswordView = () => {
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
                            name: 'Quên mật khẩu',
                            url: '/login'
                        }]}
                    />
                </Box>
                <ResetPasswordForm/>
            </Box>
        </>
    )
}