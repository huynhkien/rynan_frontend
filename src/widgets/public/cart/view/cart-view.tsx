import { Banner } from "@/shared/components/layout/public/Banner"
import { Container } from "@mui/material"
import { CartForm } from "../ui/cart-form"

export const CartView = () => {
    return (
        <>
            <Banner
                category='Giỏ hàng'
                breadcrumb={[
                    {name: 'Giỏ hàng', url: '/cart'}
                ]}
            />
            <Container maxWidth='xl'
                sx={{
                    pt:5,
                    pb:25
                }}
            >
                <CartForm/>
            </Container>
        </>
    )
}