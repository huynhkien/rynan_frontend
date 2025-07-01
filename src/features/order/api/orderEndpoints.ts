export const OrderEndpoints = {
    CREATE: '/order',
    GET_ALL: '/order',
    GET_BY_ID: (id: string | number) => `/order/${id}`,
    UPDATE: (id: string | number) => `/order/${id}`,
    DELETE: (id: string | number) => `/order/${id}`,
}