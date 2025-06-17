import React from 'react';
import { Box, Typography, Avatar, Rating, Container} from '@mui/material';
import theme from '@/shared/configs/theme';

export const HomeTestimonial = () => {
  return (
    <Box
      sx={{
        minHeight: '600px',
        pt: {xs: 60},
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: 'url(/banner/banner-6.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' },
            width: '50%',
            height: '100%'
        }
      }}
    >
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        <Box sx={{width: {xs: '100%', md: '60%'}}}>
            <Typography
                sx={{
                    color: theme.palette.primary.main,
                    marginBottom: 2,
                }}
            >
                Đánh giá về chúng tôi
            </Typography>
            <Typography
            variant="h4"
            sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                marginBottom: 2,
            }}
            >
                Khách hàng nói gì về chúng tôi?
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    marginBottom: 3,
                }}
                >
                {[...Array(6)].map((_, i) => (
                    <Box
                    key={i}
                    sx={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: '50%',
                    }}
                    />
                ))}
                <Box
                    sx={{
                    width: '30px',
                    height: '2px',
                    backgroundColor: theme.palette.secondary.main,
                    }}
                />
                </Box>
                <Typography
                sx={{
                    marginBottom: 4,
                    fontStyle: 'italic',
                }}
                >
                Là đối tác lâu năm của Rynan Smart Agriculture, chúng tôi đã thấy rõ sự khác biệt mà các giải pháp và sản phẩm ở đây mang lại cho hoạt động kinh doanh nông sản. Trong lĩnh vực nông nghiệp, việc chọn đúng sản phẩm không chỉ ảnh hưởng đến năng suất mà còn quyết định hiệu quả kinh doanh. Những sản phẩm chất lượng cao, cùng đội ngũ hỗ trợ tận tâm đã tiếp thêm năng lượng, động lực và niềm tin cho chúng tôi trong hành trình phát triển.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    sx={{
                    width: 50,
                    height: 50,
                    border: `2px solid ${theme.palette.warning.main}`,
                    }}
                />
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        sx={{
                        fontWeight: 'bold',
                        }}
                    >
                        Nguyen Van A
                    </Typography>
                    <Rating
                        value={5}
                        readOnly
                        size="small"
                        sx={{
                        '& .MuiRating-iconFilled': {
                            color: '#FFD54F',
                        },
                        }}
                    />
                    </Box>
                    <Typography>
                    TP. Trà Vinh, Tỉnh Trà Vinh.
                    </Typography>
                </Box>
                </Box>
            </Box>
      </Container>
    </Box>
  );
};
