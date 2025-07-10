'use client'
import { getAllProduct } from "@/features/product/api/productApi";
import { Product } from "@/features/product/type/productType";
import ProductCard from "@/widgets/public/product/ui/product-card";
import { Box, Container, Tab, Tabs, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";

export const HomeProduct = () => {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);
    const [product, setProduct] = useState<Product[]>([]);

    const fetchProduct = async (sort: string = '') => {
        const response = await getAllProduct({ sort, limit: 12 });
        if (response.success) {
            let products = response.data || [];

            // Nếu là random, shuffle mảng
            if (sort === 'random') {
                products = products.sort(() => 0.5 - Math.random());
            }

            setProduct(products);
        }
    };

    // Gọi API mỗi khi tab thay đổi
    useEffect(() => {
        switch (tabIndex) {
            case 0:
                fetchProduct('random');
                break;
            case 1:
                fetchProduct('createdAt');
                break;
            case 2:
                fetchProduct('-sold');
                break;
            default:
                fetchProduct('');
        }
    }, [tabIndex]);

    return (
        <Container sx={{ color: theme.palette.text.primary, pb: 7 }}>
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
                <Tab label="Gợi Ý Hôm Nay" sx={{ color: theme.palette.text.primary }} />
                <Tab label="Sản Phẩm Mới" sx={{ color: theme.palette.text.primary }} />
                <Tab label="Mua Nhiều" sx={{ color: theme.palette.text.primary }} />
            </Tabs>
            <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" }, gap: 5.5 }}>
                {product.map((item, index) => (
                    <ProductCard data={item} key={index} />
                ))}
            </Box>
        </Container>
    );
};
