'use client'
import { 
    Box, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Stack,
    Chip,
    Container,
    Paper
} from "@mui/material"
import { useParams } from "next/navigation"
import { 
    CheckCircleOutline, 
    ErrorOutline, 
    Home, 
    Receipt,
    Refresh 
} from "@mui/icons-material"
import theme from "@/shared/configs/theme"
import { LinkTransition } from "@/shared/components/ui/public/LinkTransition"

export const ReturnOrderVNPView = () => {
    const { status } = useParams();
    
    const isSuccess = status === '00';
    
    const getStatusInfo = () => {
        if (isSuccess) {
            return {
                icon: <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main' }} />,
                title: "Thanh toán thành công!",
                message: "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm nhất.",
                chipLabel: 'Thành công',
                primaryButtonColor: 'success',
                bgGradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
            };
        } else {
            return {
                icon: <ErrorOutline sx={{ fontSize: 80, color: 'error.main' }} />,
                title: "Thanh toán thất bại!",
                message: "Giao dịch không thể hoàn tất. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.",
                chipLabel: 'Thất bại',
                primaryButtonColor: 'error',
                bgGradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
            };
        }
    };
    
    const statusInfo = getStatusInfo();
    return (
        <Box 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.palette.secondary.dark,
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Card 
                    sx={{
                        borderRadius: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        background: theme.palette.text.secondary
                    }}
                >
                    <Box 
                        sx={{
                            background: statusInfo.bgGradient,
                            py: 6,
                            px: 4,
                            textAlign: 'center',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Chip 
                                label={statusInfo.chipLabel}
                                variant="filled"
                                sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: theme.typography.body1.fontSize,
                                    px: 2
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                mb: 2,
                                animation: 'bounce 1s ease-in-out',
                                '@keyframes bounce': {
                                    '0%, 20%, 53%, 80%, 100%': {
                                        transform: 'translateY(0)'
                                    },
                                    '40%, 43%': {
                                        transform: 'translateY(-15px)'
                                    },
                                    '70%': {
                                        transform: 'translateY(-7px)'
                                    },
                                    '90%': {
                                        transform: 'translateY(-3px)'
                                    }
                                }
                            }}
                        >
                            {statusInfo.icon}
                        </Box>
                        
                        <Typography 
                            variant="h4" 
                            component="h1"
                            sx={{ 
                                fontWeight: 'bold',
                                color: isSuccess ? 'success.main' : 'error.main',
                                mb: 2
                            }}
                        >
                            {statusInfo.title}
                        </Typography>
                        
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'text.primary',
                                maxWidth: 400,
                                mx: 'auto'
                            }}
                        >
                            {statusInfo.message}
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <Paper 
                            elevation={0}
                            sx={{
                                bgcolor: 'grey.50',
                                p: 3,
                                borderRadius: 2,
                                mb: 4,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            <Typography 
                                variant="subtitle2" 
                                color="text.primary" 
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                Chi tiết giao dịch
                            </Typography>
                            
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Trạng thái:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {statusInfo.chipLabel}
                                    </Typography>
                                </Box>
                                {!isSuccess &&
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Thông báo:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        Đơn hàng đã bị xóa khỏi hệ thông do thanh toán không thành công. Quý khách vui lòng tạo đơn hàng mới và thanh toán. Xin cảm ơn
                                    </Typography>
                                </Box>
                                }
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Thời gian:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {new Date().toLocaleString('vi-VN')}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                        <Stack sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap:2,
                            flexDirection: 'row'
                        }}>
                            {isSuccess ? (
                                <>
                                    <LinkTransition href="/user/order-management">
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<Receipt />}
                                            sx={{
                                                py: 2,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            Xem đơn hàng của tôi
                                        </Button>
                                    </LinkTransition>
                                    
                                    <LinkTransition href="/">
                                            <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Home />}
                                            sx={{
                                                py: 2,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    transform: 'translateY(-1px)'
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            Về trang chủ
                                        </Button>
                                    </LinkTransition>
                                </>
                            ) : (
                                <>
                                    <LinkTransition href="/checkout">
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<Refresh />}
                                            sx={{
                                                py: 2,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            Thử lại thanh toán
                                        </Button>
                                    </LinkTransition>
                                    
                                    <LinkTransition href="/">
                                            <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Home />}
                                            sx={{
                                                py: 2,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    transform: 'translateY(-1px)'
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            Về trang chủ
                                        </Button>
                                    </LinkTransition>
                                </>
                            )}
                        </Stack>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.primary">
                                Cần hỗ trợ? Liên hệ{' '}
                                <Typography 
                                    component="a" 
                                    href="mailto:support@company.com"
                                    variant="caption"
                                    sx={{ 
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    support@company.com
                                </Typography>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}