export const OrderEndpoints = {
    CREATE: '/order',
    GET_ALL: '/order',
    GET_BY_ID: (id: string | number) => `/order/${id}`,
    UPDATE: (id: string | number) => `/order/${id}`,
    DELETE: (id: string | number) => `/order/${id}`,
    UPDATE_PRODUCT_ORDER: (id: string | number, pid: string | number) => `/order/update-product-order/${id}/${pid}`,
    DELETE_PRODUCT_ORDER: (id: string | number, pid: string | number) => `/order/delete-product-order/${id}/${pid}`,
}