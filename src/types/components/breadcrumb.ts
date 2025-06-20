export interface breadcrumb {
    name: string,
    url: string
}
export interface BreadcrumbProps {
    breadcrumb: breadcrumb[],
    type?: string
}


export interface BannerBreadcrumbProps {
  category?: string;
  breadcrumb: breadcrumb[];
}
