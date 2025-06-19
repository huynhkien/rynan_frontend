import { Banner } from "@/shared/components/layout/public/Banner"
import { Box, Container } from "@mui/material"
import { CheckoutInfo } from "../ui/checkout-info"
import { CheckoutSummary } from "../ui/checkout-summary"

export const CheckoutView = () => {
    return (
        <>
            <Banner
                category='Thanh toán'
                breadcrumb={[{
                    title: 'Thanh toán',
                    url: '/checkout'
                }]}
            />
            <Container maxWidth='xl'
                sx={{
                    pt: 5,
                    pb: 25,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        width: '60%'
                    }}
                >
                    <CheckoutInfo/>
                </Box>
                <Box
                    sx={{
                        width: '40%'
                    }}
                >
                    <CheckoutSummary/>
                </Box>
            </Container>
        </>
    )
}