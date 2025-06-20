import { Banner } from "@/shared/components/layout/public/Banner"
import { ProductDetailInfo } from "../ui/product-detail-info"
import { Container } from "@mui/material"
import { ProductDetailTab } from "../ui/product-detail-tab"

export const ProductDetailView = () => {
    return (
        <>
        <Banner
                category='Chi tiết sản phẩm'
                breadcrumb={[
                    { name: 'Sản phẩm', url: '/products' },
                    { name: 'Chi tiết sản phẩm', url: '/products/123' }
                ]}
            />
            <Container maxWidth='xl' sx={{py:5}}>
                <ProductDetailInfo/>
                <ProductDetailTab/>
            </Container>
        </>
    )
}