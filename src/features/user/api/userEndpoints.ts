export const UserEndpoints = {
    REGISTER: '/user/register',
    CHECK_MAIL: '/user/check-mail',
    LOGIN: '/user/login',
    ADD_ROLE: '/user/add-role',
    FINAL_REGISTER: '/user/final-register',
    GET_ALL: '/user/',
    GET_BY_ID: (id: string | number) => `/user/${id}`,
    GET_CURRENT: '/user/find-user',
    UPDATE: (id: string | number) => `/user/${id}`,
    ADD:  '/user/add-user',
    DELETE: (id: string | number) => `/user/${id}`,
}