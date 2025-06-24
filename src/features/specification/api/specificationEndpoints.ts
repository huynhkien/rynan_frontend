export const SpecificationEndpoints = {
    CREATE: '/specification',
    GET_ALL: '/specification',
    GET_BY_ID: (id: string | number) => `/specification/${id}`,
    UPDATE: (id: string | number) => `/specification/${id}`,
    DELETE: (id: string | number) => `/specification/${id}`,
}