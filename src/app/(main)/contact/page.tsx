import { Banner } from "@/shared/components/layout/Banner";
import { ContactView } from "@/widgets";
import {Box } from "@mui/material";

const About = () => {
  return (
    <>
        <Banner
          category="Liên Hệ"
          breadcrumb={[
            {
              title: 'Liên hệ',
              url: '/about',
            },
          ]}
        />
        <Box>
            <ContactView/>
        </Box>
    </>
  );
}

export default About;
