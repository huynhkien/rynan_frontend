import { Banner } from "@/shared/components/layout/public/Banner"
import { CheckoutInfo } from "../ui/checkout-info"

export const CheckoutView = () => {
    return (
        <>
            <Banner
                category='Thanh toán'
                breadcrumb={[{
                    name: 'Thanh toán',
                    url: '/checkout'
                }]}
            />
            <CheckoutInfo/>
        </>
    )
}