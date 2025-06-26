'use client'
import { GetProductBySlug } from "@/features/product/api/productApi";
import { Product } from "@/features/product/type/productType";
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
        <Box>
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