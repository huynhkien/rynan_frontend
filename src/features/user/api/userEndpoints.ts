export const UserEndpoints = {
    REGISTER: '/user/register',
    LOGIN: '/user/login',
    FINAL_REGISTER: '/user/final-register',
    GET_ALL: '/user',
    GET_BY_ID: (id: string | number) => `/user/${id}`,
    GET_CURRENT: () => '/user/find-user',
    UPDATE: (id: string | number) => `/user/${id}`,
    DELETE: (id: string | number) => `/user/${id}`,
}