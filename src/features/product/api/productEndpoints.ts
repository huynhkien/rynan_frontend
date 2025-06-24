export const ProductEndpoints = {
    CREATE: '/product',
    GET_ALL: '/product',
    GET_BY_ID: (id: string | number) => `/product/${id}`,
    UPDATE: (id: string | number) => `/product/${id}`,
    UPDATE_DESCRIPTION: (id: string | number) => `/product/update-description/${id}`,
    DELETE: (id: string | number) => `/product/${id}`,
    GET_BY_SLUG: (slug: string ) => `/product/${slug}`
}