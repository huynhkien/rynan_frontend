import { Box } from "@mui/material"

export const LoginView = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '700px',
                position: 'relative',
                '&::after': {
                    content:'""',
                    backgroundImage: 'url(/banner/banner-4.jpg)',
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    top: 0,
                    left: 0
                }
            }}
        >
            Trang đăng nhập
        </Box>
    )
}