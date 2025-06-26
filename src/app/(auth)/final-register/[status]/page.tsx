'use client'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { Box, CircularProgress, Typography, Card, CardContent, useTheme } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Error, HourglassEmpty } from '@mui/icons-material';

const FinalRegister = () => {
  const { status } = useParams();
  const theme = useTheme();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Delay một chút để tạo cảm giác đang xử lý
    const timer = setTimeout(() => {
      setIsProcessing(false);
      
      if (status === 'failed') {
        Swal.fire({
          title: 'Oops!',
          text: 'Đăng ký không thành công!',
          icon: 'error',
          confirmButtonText: 'Thử lại',
          confirmButtonColor: '#d33'
        }).then(() => {
          router.push(`/login`);
        });
      }
      
      if (status === 'succeeded') {
        Swal.fire({
          title: 'Congratulations!',
          text: 'Đăng ký thành công! Chào mừng bạn đến với Rynan Smart Agriculture.',
          icon: 'success',
          confirmButtonText: 'Đăng nhập ngay',
          confirmButtonColor: '#28a745'
        }).then(() => {
          router.push(`/login`);
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [status, router]);

  const getStatusIcon = () => {
    if (isProcessing) return <HourglassEmpty sx={{ fontSize: 60, color: theme.palette.warning.main }} />;
    if (status === 'success') return <CheckCircle sx={{ fontSize: 60, color: theme.palette.success.main }} />;
    if (status === 'failed') return <Error sx={{ fontSize: 60, color: theme.palette.error.main }} />;
    return null;
  };

  const getStatusText = () => {
    if (isProcessing) return 'Đang xử lý đăng ký...';
    if (status === 'success') return 'Đăng ký thành công!';
    if (status === 'failed') return 'Đăng ký thất bại!';
    return 'Trạng thái không xác định';
  };

  const getStatusColor = () => {
    if (isProcessing) return `${theme.palette.warning.main}`;
    if (status === 'success') return `${theme.palette.success.main}`;
    if (status === 'failed') return `${theme.palette.error.main}`;
    return `${theme.palette.error.main}`;
  };

  return (
    <Box 
      className='bg-light'
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Card 
        elevation={8}
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.primary.main,
              marginBottom: 3
            }}
          >
            Rynan Smart Agriculture
          </Typography>

          <Box sx={{ marginBottom: 3 }}>
            {getStatusIcon()}
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              color: getStatusColor(),
              fontWeight: 'medium',
              marginBottom: 2
            }}
          >
            {getStatusText()}
          </Typography>

          {isProcessing && (
            <Box sx={{ marginTop: 3 }}>
              <CircularProgress size={30} sx={{ color: theme.palette.warning.main }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  marginTop: 2, 
                  color: '#6c757d',
                  fontStyle: 'italic'
                }}
              >
                Vui lòng đợi trong giây lát...
              </Typography>
            </Box>
          )}

          {!isProcessing && (
            <Typography 
              variant="body2" 
              sx={{ 
                marginTop: 2, 
                color: theme.palette.info.main
              }}
            >
              {status === 'success' 
                ? 'Bạn sẽ được chuyển hướng đến trang đăng nhập.'
                : 'Bạn sẽ được chuyển hướng để thử lại.'
              }
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default FinalRegister;