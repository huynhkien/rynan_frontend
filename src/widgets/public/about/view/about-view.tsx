import { Banner } from "@/shared/components"
import { AboutInfo } from "../ui/about-info"
import { AboutWelcome } from "../ui/about-welcome"

export const AboutView = () => {
    return (
        <>
             <Banner
                      category="Trang chủ"
                      breadcrumb={[
                        {
                          name: 'Giới Thiệu',
                          url: '/about',
                        },
                      ]}
                    />
            <AboutWelcome/>
            <AboutInfo/>
        </>
    )
}