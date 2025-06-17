'use client';
import { Box, Card, CardContent, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';

export const ProductFilterRating = () => {
  const theme = useTheme();

  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card
      sx={{
        border: `1px solid ${theme.palette.primary.dark}`,
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          p: 2,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: theme.typography.fontWeightBold }}>
          Lọc theo đánh giá
        </Typography>
      </Box>
      <CardContent sx={{ p: 3, cursor: 'pointer' }}>
        <Stack spacing={2}>
          {ratings.map((star) => (
            <Typography
              key={star}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  color: theme.palette.warning.main,
                  transform: 'translateX(5px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {[...Array(star)].map((_, i) => (
                <StarIcon key={i} fontSize="small" sx={{ color: theme.palette.warning.main }} />
              ))}
              trở lên
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
