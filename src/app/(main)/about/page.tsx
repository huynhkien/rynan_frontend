import { Banner } from "@/shared/components/layout/Banner";
import { AboutView } from "@/widgets";
import {Box } from "@mui/material";

const About = () => {
  return (
    <>
        <Banner/>
        <Box>
            <AboutView/>
        </Box>
    </>
  );
}

export default About;
