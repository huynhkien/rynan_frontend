export const ReceiptEndpoints = {
    CREATE_IMPORT_RECEIPT: '/receipt/create-import-receipt',
    CREATE_EXPORT_RECEIPT: '/receipt/create-export-receipt',
    GET_ALL: '/receipt',
    DELETE_RECEIPTS: '/receipt/delete-receipts',
    GET_BY_ID: (id: string | number) => `/receipt/${id}`,
    UPDATE: (id: string | number) => `/receipt/${id}`,
    DELETE: (id: string | number) => `/receipt/${id}`,
    UPDATE_PRODUCT_RECEIPT: (rid: string | number, pid: string | number) => `/receipt/update-product-receipt/${rid}/${pid}`,
    UPDATE_MATERIAL_RECEIPT: (rid: string | number, mid: string | number) => `/receipt/update-material-receipt/${rid}/${mid}`,
    DELETE_PRODUCT_RECEIPT: (rid: string | number, pid: string | number) => `/receipt/delete-product-receipt/${rid}/${pid}`,
    DELETE_MATERIAL_RECEIPT: (rid: string | number, mid: string | number) => `/receipt/delete-material-receipt/${rid}/${mid}`,
}