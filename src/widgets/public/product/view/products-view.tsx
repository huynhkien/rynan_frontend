'use client'
import { Banner } from "@/shared/components/layout/public/Banner"
import { Box, Container } from "@mui/material"
import {ProductFilterPrice } from "../ui/product-filter-price"
import ProductCard from "../ui/product-card"
import { ProductFilterCategory } from "../ui/product-filter-category"
import { ProductFilterRating } from "../ui/product-filter-rating"
import { ProductSort } from "../ui/product-sort"
import { useCallback, useState } from "react"
import { Pagination } from "@/shared/components/ui/public/Pagination"
import { ProductSortOption } from "@/shared/constant/common"

export const ProductsView = () => {
    const [sort, setSort] = useState('');
    const handleSortChange = useCallback((value: string | number) => {
    setSort(value.toString()); 
  }, []);
    return (
        <>
            <Banner
                category='Sản phẩm'
                breadcrumb={[{
                    name: 'Sản phẩm',
                    url: '/products'
                }]}
            />
            <Container maxWidth='xl'
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 5,
                    py:5
                }}
            >
                <Box sx={{
                    width: '30%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5
                }}>
                    <ProductFilterCategory/>
                    <ProductFilterPrice/>
                    <ProductFilterRating/>
                </Box>
                <Box
                    sx={{
                        width: '70%'
                    }}
                >
                    <Box
                        sx={{
                            pb:5
                        }}
                    >
                        <ProductSort
                            options={ProductSortOption}
                            value={sort}
                            changeValue={handleSortChange}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 9,
                        }}>
                            {Array(12).fill(0).map((_, index) => (
                                <ProductCard key={index} />
                            ))}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py:5
                        }}
                    >
                        <Pagination/>
                    </Box>
                </Box>
            </Container>
        </>
    )
}