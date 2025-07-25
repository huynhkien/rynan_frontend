export const MaterialEndpoints = {
    CREATE: '/material',
    GET_ALL: '/material',
    DELETE_MATERIALS: '/material/delete-materials',
    GET_BY_ID: (id: string | number) => `/material/${id}`,
    UPDATE: (id: string | number) => `/material/${id}`,
    DELETE: (id: string | number) => `/material/${id}`,
}