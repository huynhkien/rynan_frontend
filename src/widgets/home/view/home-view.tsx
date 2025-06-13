import { HomeAbout, HomePartner, HomePortfolio, HomeProduct, HomeSlides } from '../../index';
import HomeBanner from '../ui/home-banner';
import HomeTestimonial from '../ui/home-testimonial';
import HomeWhyUs from '../ui/home-whyUs';

export const HomeView = () => {
    return (
        <>
            <HomeSlides/>
            <HomePortfolio/>
            <HomeAbout/>
            <HomeProduct/>
            <HomeBanner/>
            <HomeWhyUs/>
            <HomeTestimonial/>
            <HomePartner/>
        </>
    )
}