'use client'
import ProductCard from "@/widgets/product/ui/product-card";
import { Box, Container, Tab, Tabs, Typography, useTheme } from "@mui/material"
import { useState } from "react";

export const HomeProduct = () => {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Container sx={{color: theme.palette.text.primary, pb:5}}>
            <Box sx={{ textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h4" fontWeight="bold" mt={1}>
                Các Sản Phẩm Tại Cửa Hàng
                </Typography>
                <Typography variant="body1" mt={1} mb={4} px={{ xs: 2, md: 25 }}>
                Rynan Smart Agriculture mang đến giải pháp toàn diện từ phân bón chuyên dụng đến thiết bị IoT hiện đại, giúp bạn chăm sóc cây trồng hiệu quả, tiết kiệm và bền vững.
                </Typography>
            </Box>
            <Tabs
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                centered
                sx={{
                width: { xs: "100%", md: "50%" },
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                }}
            >
                <Tab label="Gợi Ý Hôm Nay" sx={{color: theme.palette.text.primary}} />
                <Tab label="Sản Phẩm Mới" sx={{color: theme.palette.text.primary}} />
                <Tab label="Lượt Mua" sx={{color: theme.palette.text.primary}} />
            </Tabs>
            <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" }, gap: 3 }}>
                {Array.from({ length: 12 }).map((_, index) => (
                <ProductCard key={index} />
                ))}
            </Box>
        </Container>
    )
}