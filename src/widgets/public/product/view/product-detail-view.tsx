'use client'
import { Banner } from "@/shared/components/layout/public/Banner"
import { ProductDetailInfo } from "../ui/product-detail-info"
import { Container } from "@mui/material"
import { ProductDetailTab } from "../ui/product-detail-tab"
import { useParams } from "next/navigation"

export const ProductDetailView = () => {
    const {slug} = useParams();
    return (
        <>
        <Banner
                category='Chi tiết sản phẩm'
                breadcrumb={[
                    { name: 'Sản phẩm', url: '/products' },
                    { name: 'Chi tiết sản phẩm', url: `${slug}` }
                ]}
            />
            <Container maxWidth='xl' sx={{py:5}}>
                <ProductDetailInfo slug={slug as string}/>
                <ProductDetailTab slug={slug as string}/>
            </Container>
        </>
    )
}