'use client'
import { Box, Typography, useTheme, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HomeIcon from '@mui/icons-material/Home';
import { BreadcrumbProps } from '@/types/components/breadcrumb';

export const Breadcrumb = ({breadcrumb, type}: BreadcrumbProps) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                py: 2,
                px: 3,
                
            }}
        >
            <Breadcrumbs
                separator={
                    <ArrowForwardIosIcon 
                        sx={{
                            fontSize: theme.typography.body1.fontSize,
                            color: theme.palette.text.disabled,
                            mx: 0.5
                        }}
                    />
                }
                aria-label='breadcrumb'
                sx={{
                    '& .MuiBreadcrumbs-separator': {
                        margin: '0 8px'
                    }
                }}
            >
                <Link 
                    href={type === 'Admin' ? '/admin' : '/'}
                    style={{ textDecoration: 'none' }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1,
                            py: 1,
                            borderRadius: '8px',
                            color: theme.palette.primary.light,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                color: theme.palette.primary.main,
                                background: `${theme.palette.primary.main}08`,
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        <HomeIcon sx={{ fontSize: theme.typography.body2.fontSize }} />
                        <Typography 
                            variant='body1' 
                            sx={{ 
                                fontWeight: theme.typography.fontWeightBold,
                            }}
                        >
                            Trang chủ
                        </Typography>
                    </Box>
                </Link>
                {breadcrumb.map((el, index) => (
                    <Link key={index} href={el?.url} style={{textDecoration: 'none'}}>
                        <Typography 
                            variant='body1' 
                            sx={{ 
                                fontWeight: theme.typography.fontWeightBold,
                                color: theme.palette.primary.light,
                                px: 1,
                                py: 1,
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    background: `${theme.palette.primary.main}08`,
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            {el?.name}
                        </Typography>
                    </Link>
                ))}
            </Breadcrumbs>
        </Box>
    )
}