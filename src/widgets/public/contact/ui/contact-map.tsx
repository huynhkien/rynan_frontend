import { Box } from "@mui/material";

export const ContactMap = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: 450,
                border: 0,
                overflow: 'hidden',
            }}
        >
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5884466660136!2d106.34701117573015!3d9.968157773580419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a01be26367ea6b%3A0x145204d8dc2d177e!2zS2h1IEPDtG5nIE5naGnhu4dwIExvbmcgxJDhu6lj!5e0!3m2!1svi!2s!4v1750143241518!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </Box>
    );
};
