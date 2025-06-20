import { Box, Container } from "@mui/material"
import { ContactForm } from "../ui/contact-form"
import { ContactInfo } from "../ui/contact-info"
import { ContactMap } from "../ui/contact-map"
import { Banner } from "@/shared/components"

export const ContactView = () => {
    return (
        <>
             <Banner
                category="Liên Hệ"
                breadcrumb={[
                    {
                    name: 'Liên hệ',
                    url: '/about',
                    },
                ]}
                />
            <Box
                sx={{
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        backgroundImage: 'url(/banner/banner-8.jpg)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '300px',
                        zIndex: -1
                    }
                }}
            >
                <Container
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 5,
                        py:5,
                        zIndex:5
                    }}
                >
                    <Box sx={{width: '40%'}}>
                        <ContactInfo/>
                    </Box>
                    <Box sx={{width: '60%'}}>
                        <ContactForm/>
                    </Box>
                </Container>
            </Box>
            <ContactMap/>
        </>
    )
}