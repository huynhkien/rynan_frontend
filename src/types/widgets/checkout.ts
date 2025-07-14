export interface CheckoutInfoProps {
    email: string;
    name: string;
    phone: string;
    address: {
        province: string; 
        ward: string;
        district: string;
        addressAdd: string;
    },
    note?: string;
    
}
