export const ProductEndpoints = {
    CREATE: '/product',
    GET_ALL: '/product',
    ADD_RATING: '/product/add-rating',
    ADD_REPLY: (pid: string | number, rid: string | number) => `/product/add-reply/${pid}/${rid}`,
    ADD_REPLY_CHILD: (pid: string | number, cid: string | number) => `/product/add-reply-child/${pid}/${cid}`,
    DELETE_RATING: (pid: string | number, rid: string | number) =>  `/product/delete-rating/${pid}/${rid}`,
    GET_BY_ID: (id: string | number) => `/product/${id}`,
    UPDATE: (id: string | number) => `/product/${id}`,
    DELETE_PRICE_PRODUCT: (id: string | number, rid: string) => `/product/delete-price/${id}/${rid}`,
    UPDATE_PRICE_PRODUCT: (id: string | number, rid: string) => `/product/update-price/${id}/${rid}`,
    ADD_UPDATE_PRICE_PRODUCT: (id: string | number) => `/product/add-update-price/${id}`,
    UPDATE_DESCRIPTION: (id: string | number) => `/product/update-description/${id}`,
    ADD_PRICE: (id: string | number) => `/product/add-price/${id}`,
    DELETE: (id: string | number) => `/product/${id}`,
    GET_BY_SLUG: (slug: string ) => `/product/detail/${slug}`,
    DELETE_REPLY: (id: string | number, rid: string | number, repId: string| number ) => `/product/delete-reply/${id}/${rid}/${repId}`
}