'use client'
import { Box, Typography, useTheme } from "@mui/material";
import {
  PrecisionManufacturing as TechIcon,
  Forest as EcoIcon,
  Security as SafetyIcon,
  Science as InnovationIcon,
  WaterDrop as WaterIcon
} from '@mui/icons-material';

export const AboutInfo = () => {
    const theme = useTheme();
    const features = [
        { icon: <TechIcon />, title: 'Công nghệ nông nghiệp thông minh' },
        { icon: <EcoIcon />, title: 'Giải pháp thân thiện môi trường' },
        { icon: <SafetyIcon />, title: 'An toàn cho người tiêu dùng' },
        { icon: <InnovationIcon />, title: 'Đổi mới & sáng tạo liên tục' },
        { icon: <WaterIcon />, title: 'Quản lý nước hiệu quả' },
    ];

    return (
        <Box sx={{ 
            textAlign: 'center',
            pb: 20 
        }}>
        {/* Title */}
        <Typography 
            variant='h4' 
            sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 'bold',
            mb: 2
            }}
        >
            RYNAN cam kết vì nông nghiệp bền vững!
        </Typography>

        {/* Subtitle */}
        <Typography 
            variant="body1" 
            sx={{ mb: 6, maxWidth: 600, margin: '0 auto 48px' }}
        >
            Chúng tôi ứng dụng công nghệ tiên tiến để nâng cao chất lượng nông sản, bảo vệ môi trường và cải thiện đời sống nông dân.
        </Typography>

        {/* Features */}
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4, 
            mb: 6,
            flexWrap: 'wrap'
        }}>
            {features.map((feature, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
                <Box sx={{
                    border: `2px solid ${theme.palette.primary.light}`,
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 16px',
                }}>
                {feature.icon}
                </Box>
                <Typography variant="body2" fontWeight="600">
                {feature.title}
                </Typography>
            </Box>
            ))}
        </Box>

        </Box>
    );
};
