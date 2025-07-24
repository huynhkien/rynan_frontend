export const SpecificationEndpoints = {
    CREATE: '/specification',
    GET_ALL: '/specification',
    DELETE_SPECIFICATIONS: '/specification/delete-specifications',
    GET_BY_ID: (id: string | number) => `/specification/${id}`,
    UPDATE: (id: string | number) => `/specification/${id}`,
    DELETE: (id: string | number) => `/specification/${id}`,
}