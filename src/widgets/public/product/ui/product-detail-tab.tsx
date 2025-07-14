'use client'
import { Box, Tab, Tabs, useTheme } from '@mui/material'
import { useState } from 'react';
import { ProductDetailTabDescription } from './product-detail-tab-description';
import { ProductDetailTabRating } from './product-detail-tab-rating';

export const ProductDetailTab = ({slug}: {slug: string}) => {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState<number>(0); 
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue >= 0 && newValue <= 1) {
            setTabIndex(newValue);
        } else {
            setTabIndex(0);
        }
    };

    const getInfoTab = () => {
        switch(tabIndex) {
            case 0:
                return <ProductDetailTabDescription slug={slug}/>;
            case 1: 
                return <ProductDetailTabRating slug={slug}/>;
            default:
                return <ProductDetailTabDescription slug={slug}/>;
        }
    }

    return (
        <Box>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                sx={{
                    width: { xs: '100%', md: '50%' },
                    display: 'flex',
                    borderRadius: '5px',
                    py: 5
                }}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab 
                    label='Thông tin mô tả' 
                    sx={{
                        color: theme.palette.text.primary,
                        '&.Mui-selected': {
                            color: theme.palette.text.secondary,
                            backgroundColor: theme.palette.primary.light,
                        }
                    }} 
                />
                <Tab 
                    label='Đánh giá' 
                    sx={{
                        color: theme.palette.text.primary,
                        '&.Mui-selected': {
                            color: theme.palette.text.secondary,
                            backgroundColor: theme.palette.primary.light,
                        }
                    }} 
                />
            </Tabs>
            <Box>
                {getInfoTab()}
            </Box>
        </Box>
    )
}