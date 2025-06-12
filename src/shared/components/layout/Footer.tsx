'use client'
import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LocationOn,
  Phone,
  Email,
  Schedule,
} from '@mui/icons-material';
import Image from 'next/image';

interface NewsPost {
  id: string;
  title: string;
  date: string;
  image: string;
}

export const Footer: React.FC = () => {
    const theme = useTheme();
    const newsPlaceholder = '/api/placeholder/60/60';
    const newsPosts: NewsPost[] = [
        {
        id: '1',
        title: 'Learn 10 Best Tips for New Formers',
        date: '30 Oct, 2024',
        image: newsPlaceholder,
        },
        {
        id: '2',
        title: 'Farmer Sentiment Darkens Hopes Fade',
        date: '30 Oct, 2024',
        image: newsPlaceholder,
        },
    ];

    const quickLinks = [
        'Learn About Us',
        'Services We Provide',
        'View Recent Projects',
        'Meet The Farmers',
        'Up Coming Events',
    ];

    return (
        <Box
        component="footer"
        sx={{
            background: theme.palette.primary.main,
            color: 'white',
            py: 1,
            position: 'relative',
            overflow: 'hidden',
        }}
        >
            <Box sx={{}}>
                <Image src='/shape/grass-2.png' width={0} height={0} alt='shape-1'
                style={{
                    width: '100%',
                    height: '60px', 
                    objectFit: 'cover'
                }}/>
            </Box>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header Section */}
                <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                >
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                    sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#FFA726',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                    }}
                    >
                    🌾
                    </Box>
                    <Box>
                    <Typography variant="h5" fontWeight="bold">
                        DonalFarm
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B8860B' }}>
                        Agriculture and Organic Farm
                    </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                    fontStyle: 'italic',
                    color: '#FFF59D',
                    }}
                >
                    Farm of laughter and happiness!
                </Typography>

                <Box display="flex" gap={1}>
                    {[Facebook, Twitter, Instagram, LocationOn].map((Icon, index) => (
                    <IconButton
                        key={index}
                        sx={{
                        backgroundColor: '#FFA726',
                        color: 'white',
                        width: 40,
                        height: 40,
                        '&:hover': {
                            backgroundColor: '#FF9800',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                        }}
                    >
                        <Icon fontSize="small" />
                    </IconButton>
                    ))}
                </Box>
                </Box>

                {/* Main Content */}
                <Box
                display="flex"
                flexWrap="wrap"
                gap={4}
                justifyContent="space-between"
                >
                {/* Contact Us */}
                <Box flex={{ xs: '1 1 100%', md: '1 1 22%' }} minWidth={280}>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                    Contact Us!
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                        <LocationOn sx={{ color: '#FFA726', mt: 0.5 }} />
                        <Typography variant="body2">
                        Prinsengracht 250, 2501016 PM<br />
                        Amsterdam Netherlands
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Phone sx={{ color: '#FFA726' }} />
                        <Typography variant="body2">Call us: (234) 109-6666</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Email sx={{ color: '#FFA726' }} />
                        <Typography variant="body2">Mail: Donalfarms@gmail.com</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Schedule sx={{ color: '#FFA726' }} />
                        <Typography variant="body2">Mon - Sat: 8.00am - 18.00pm</Typography>
                    </Box>
                    </Box>
                </Box>

                {/* News Posts */}
                <Box flex={{ xs: '1 1 100%', md: '1 1 22%' }} minWidth={280}>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                    News Posts
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={3}>
                    {newsPosts.map((post) => (
                        <Box key={post.id} display="flex" gap={2}>
                        <Box
                            sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            backgroundColor: '#FFA726',
                            flexShrink: 0,
                            backgroundImage: `url(${post.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            }}
                        />
                        <Box>
                            <Typography
                            variant="body2"
                            fontWeight="500"
                            mb={1}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { color: '#FFA726' },
                                transition: 'color 0.3s ease',
                            }}
                            >
                            {post.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#B8860B' }}>
                            {post.date}
                            </Typography>
                        </Box>
                        </Box>
                    ))}
                    </Box>
                </Box>

                {/* Quick Links */}
                <Box flex={{ xs: '1 1 100%', md: '1 1 22%' }} minWidth={280}>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                    Quick Links
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                    {quickLinks.map((link, index) => (
                        <Link
                        key={index}
                        href="#"
                        underline="none"
                        sx={{
                            color: 'white',
                            fontSize: '0.875rem',
                            '&:hover': {
                            color: '#FFA726',
                            transform: 'translateX(5px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                        >
                        {link}
                        </Link>
                    ))}
                    </Box>
                </Box>

                </Box>

                {/* Bottom Section */}
                <Box mt={6}>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Copyright © 2025 by Kien
                    . All Rights Reserved.
                    </Typography>
                    <Box display="flex" gap={3} flexWrap="wrap">
                    {[
                        'Confidentiality & Privacy',
                        'Legal Information',
                        'Return and Refund Policy',
                    ].map((link, index) => (
                        <Link
                        key={index}
                        href="#"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': {
                            color: '#FFA726',
                            },
                            '&:before': {
                            content: index > 0 ? '"✓"' : '""',
                            color: '#4CAF50',
                            fontSize: '0.75rem',
                            },
                        }}
                        >
                        {link}
                        </Link>
                    ))}
                    </Box>
                </Box>
                </Box>
            </Container>
        </Box>
    );
};
