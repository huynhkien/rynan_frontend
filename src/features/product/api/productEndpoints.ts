export const ProductEndpoints = {
    CREATE: '/product',
    GET_ALL: '/product',
    GET_BY_ID: (id: string | number) => `/product/${id}`,
    UPDATE: (id: string | number) => `/product/${id}`,
    DELETE_PRICE_PRODUCT: (id: string | number, rid: string) => `/product/delete-price/${id}/${rid}`,
    UPDATE_PRICE_PRODUCT: (id: string | number, rid: string) => `/product/update-price/${id}/${rid}`,
    UPDATE_DESCRIPTION: (id: string | number) => `/product/update-description/${id}`,
    ADD_PRICE: (id: string | number) => `/product/add-price/${id}`,
    DELETE: (id: string | number) => `/product/${id}`,
    GET_BY_SLUG: (slug: string ) => `/product/detail/${slug}`
}