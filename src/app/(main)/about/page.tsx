import { Banner } from "@/shared/components/layout/Banner";
import { AboutView } from "@/widgets";
import {Box } from "@mui/material";

const About = () => {
  return (
    <>
        <Banner
          category="Giới Thiệu"
          breadcrumb={[
            {
              title: 'Giới thiệu',
              url: '/about',
            },
          ]}
        />
        <Box>
            <AboutView/>
        </Box>
    </>
  );
}

export default About;
