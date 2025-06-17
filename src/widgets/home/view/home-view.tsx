import {HomeTestimonial, HomeAbout, HomeBanner, HomePartner, HomePortfolio, HomeProduct, HomeSlides } from '../../index';
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