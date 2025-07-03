export const ReceiptEndpoints = {
    CREATE_IMPORT_RECEIPT: '/receipt/create-import-receipt',
    CREATE_EXPORT_RECEIPT: '/receipt/create-export-receipt',
    GET_ALL: '/receipt',
    GET_BY_ID: (id: string | number) => `/receipt/${id}`,
    UPDATE: (id: string | number) => `/receipt/${id}`,
    DELETE: (id: string | number) => `/receipt/${id}`,
    UPDATE_PRODUCT_RECEIPT: (rid: string | number, pid: string | number) => `/receipt/update-product-receipt/${rid}/${pid}`,
    DELETE_PRODUCT_RECEIPT: (rid: string | number, pid: string | number) => `/receipt/delete-product-receipt/${rid}/${pid}`,
}