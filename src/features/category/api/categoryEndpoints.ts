export const CategoryEndpoints = {
    CREATE: '/category',
    GET_ALL: '/category',
    DELETE_CATEGORIES: '/category/delete-categories',
    GET_BY_ID: (id: string | number) => `/category/${id}`,
    UPDATE: (id: string | number) => `/category/${id}`,
    DELETE: (id: string | number) => `/category/${id}`,
    GET_BY_SLUG: (slug: string ) => `/category/${slug}`
}