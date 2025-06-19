export interface CheckoutInfoProps {
    email: string,
    name: string,
    phone: string,
    address: {
        street: string, 
        ward: string,
        district: string,
        city: string,
        country: string,
        zipCode: string
    },
    message?: string
    
}
