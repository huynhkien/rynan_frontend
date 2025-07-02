export const QuoteEndpoints = {
    CREATE: '/quote',
    GET_ALL: '/quote',
    GET_BY_ID: (id: string | number) => `/quote/${id}`,
    UPDATE: (id: string | number) => `/quote/${id}`,
    DELETE: (id: string | number) => `/quote/${id}`,
    DELETE_PRODUCT_QUOTE: (id: string | number, pid: string | number) => `/quote/delete-product-quote/${id}/${pid}`,
}