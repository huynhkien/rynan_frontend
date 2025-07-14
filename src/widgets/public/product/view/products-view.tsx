'use client'
import { Banner } from "@/shared/components/layout/public/Banner"
import { Box, Container, Typography } from "@mui/material"
import { ProductFilterPrice } from "../ui/product-filter-price"
import ProductCard from "../ui/product-card"
import { ProductFilterCategory } from "../ui/product-filter-category"
import { ProductFilterRating } from "../ui/product-filter-rating"
import { ProductSort } from "../ui/product-sort"
import { useCallback, useEffect, useMemo, useState } from "react"
import { PRODUCTS_PER_PAGE, ProductSortOption } from "@/shared/constant/common"
import { getAllProduct } from "@/features/product/api/productApi"
import { Product } from "@/features/product/type/productType"
import { ProductPagination } from "../ui/product-pagination"
import { Category } from "@/features/category/type/categoryType"
import { getAllCategory } from "@/features/category/api/categoryApi"
import { ProductFilterTag } from "../ui/product-filter-tag"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface params {
    sort?: string
}


export const ProductsView = () => {
    // Lấy page từ URL
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    console.log(currentPage);
    
    // States
    const initialMin = 0;
    const initialMax = 10000000;
    const [sortValue, setSortValue] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [priceRange, setPriceRange] = useState<number[]>([initialMin, initialMax]);
    
    // Hiển thị danh mục
    const fetchCategories = async () => {
        const response = await getAllCategory();
        if (response.success) setCategories(response.data || []);
    }
    
    // Hiển thị sản phẩm (lấy tất cả để filter tại frontend)
    const fetchProducts = async (sort?: string) => {
        let params : params = {};
        if (sort && sort.trim() !== '') {
            params = { sort } ;
        }
        const response = await getAllProduct(params.sort ? params : undefined);
        if (response.success) {
            setProducts(response.data || []);
            setLoading(true);
        }
        setLoading(false);
    }
    useEffect(() => {
        fetchCategories();
        fetchProducts(); 
    }, []);
    useEffect(() => {
        fetchProducts(sortValue);
    }, [sortValue])
    // Tính toán phân trang tại frontend
    const paginatedProducts = useMemo(() => {
        let filtered = products;
        // Lọc theo danh mục
        if (selectedCategory) {
            filtered = filtered.filter(el => el.category === selectedCategory);
        }
        // Lọc theo đánh giá
        if (selectedStar) {
            filtered = filtered.filter(el => 
                el.totalRatings >= Number(selectedStar) && 
                el.totalRatings < Number(selectedStar) + 1
            );
        }
        // Lọc theo tag
        if (selectedTag) {
            filtered = filtered.filter(el =>
                el.tags.some(t => t.tag === selectedTag)
            );
        }
        // Lọc theo khoảng giá
        if (priceRange && priceRange.length === 2) {
            filtered = filtered.filter(el => 
                el.price_reference >= priceRange[0] && 
                el.price_reference <= priceRange[1]
            );
        }
        // Tính toán phân trang
        const totalProducts = filtered.length;
        const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const currentProducts = filtered.slice(startIndex, endIndex);
        return {
            products: currentProducts,
            totalProducts,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        };
    }, [selectedCategory, selectedStar, selectedTag, priceRange, products, currentPage]);
    // Reset về trang 1 khi filter thay đổi
    const resetToFirstPage = useCallback(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1');
        router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);
    // Sắp xếp
    const handleSortChange = useCallback((value: string | number) => {
        setSortValue(value.toString());
        resetToFirstPage(); 
    }, [resetToFirstPage]);
    // Lựa chọn danh mục
    const handleSelectValueCategory = useCallback((id: string) => {
        resetToFirstPage();
        setSelectedCategory(prev => prev === id ? null : id);
    }, [resetToFirstPage]);
    
    // Lựa chọn sao
    const handleSelectValueStar = useCallback((star: number) => {
        resetToFirstPage()
        setSelectedStar(prev => prev === star ? null : star);
    }, [resetToFirstPage]);
    
    // Lựa chọn tag
    const handleSelectValueTag = useCallback((id: string) => {
        resetToFirstPage()
        setSelectedTag(prev => prev === id ? null : id);
    }, [resetToFirstPage]);
    
    // Xử lý thay đổi giá
    const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            resetToFirstPage()
            setPriceRange(newValue);
        }
    }, [resetToFirstPage]);
    
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
                    py: 5,
                }}
            >
                <Box sx={{
                    width: '30%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5
                }}>
                    <ProductFilterCategory 
                        categories={categories} 
                        products={products} 
                        handleSelectValue={handleSelectValueCategory}
                        selectedCategory={selectedCategory as string}
                    />
                    <ProductFilterPrice 
                        priceRange={priceRange}
                        minRange={initialMin}
                        maxRange={initialMax}
                        handleSliderChange={handleSliderChange}
                        currency="VNĐ"
                    />
                    <ProductFilterRating 
                        handleSelectValue={handleSelectValueStar} 
                        selectedStar={selectedStar as number} 
                    />
                    <ProductFilterTag 
                        products={products} 
                        handleSelectValue={handleSelectValueTag}
                        selectedTag={selectedTag as string}
                    />
                </Box>
                <Box sx={{ width: '70%' }}>
                    <Box sx={{ 
                        pb: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <ProductSort
                            options={ProductSortOption}
                            value={sortValue}
                            changeValue={handleSortChange}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Hiển thị {paginatedProducts.products.length} / {paginatedProducts.totalProducts} sản phẩm
                        </Typography>
                    </Box>
                    
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                            <Typography>Đang tải...</Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 9,
                                minHeight: '400px'
                            }}>
                                {paginatedProducts.products.map((item, index) => (
                                    <ProductCard data={item} key={`${item._id}-${index}`} />
                                ))}
                            </Box>
                            
                            {paginatedProducts.products.length === 0 && !loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                    <Typography>Không tìm thấy sản phẩm nào</Typography>
                                </Box>
                            )}
                        </>
                    )}
                    
                    {paginatedProducts.totalPages > 1 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 5
                        }}>
                            <ProductPagination 
                                page={paginatedProducts.currentPage} 
                                totalPage={paginatedProducts.totalPages} 
                            />
                        </Box>
                    )}
                </Box>
            </Container>
        </>
    )
}