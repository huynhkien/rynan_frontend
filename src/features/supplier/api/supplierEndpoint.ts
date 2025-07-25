export const SupplierEndpoints = {
    CREATE: '/supplier',
    GET_ALL: '/supplier',
    DELETE_SUPPLIERS: 'supplier/delete-suppliers',
    GET_BY_ID: (id: string | number) => `/supplier/${id}`,
    UPDATE: (id: string | number) => `/supplier/${id}`,
    DELETE: (id: string | number) => `/supplier/${id}`,
}