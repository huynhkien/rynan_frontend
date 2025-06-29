export const QuoteEndpoints = {
    CREATE: '/quote',
    GET_ALL: '/quote',
    GET_BY_ID: (id: string | number) => `/quote/${id}`,
    UPDATE: (id: string | number) => `/quote/${id}`,
    DELETE: (id: string | number) => `/quote/${id}`,
}