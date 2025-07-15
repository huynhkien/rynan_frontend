'use client'
import { GetProductBySlug } from "@/features/product/api/productApi";
import { Product } from "@/features/product/type/productType";
import theme from "@/shared/configs/theme";
import { Box } from "@mui/material"
import DOMPurify from 'dompurify';
import { useEffect, useState } from "react";

export const ProductDetailTabDescription = ({slug}: {slug: string}) => {
    const [productSlug, setProductSlug] = useState<Product | null>(null);
    useEffect(() => {
            const fetchProductBySlug = async() => {
                const response = await GetProductBySlug(slug);
                if(response.success) {
                    setProductSlug(response.data);
                }
            }
            fetchProductBySlug();
        },[slug]);
    return (
        <Box sx={{backgroundColor: theme.palette.secondary.dark, borderRadius: '10px', px: 2, py:1}}>
            {productSlug?.description ? (
                <Box
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productSlug.description) }}
                />
                ) : (
                <Box>Đang tải mô tả sản phẩm...</Box>
            )}
        </Box>
    )
}