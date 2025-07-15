export const ContactEndpoints = {
    CREATE: '/contact',
    GET_ALL: '/contact',
    SEND_MAIL: '/contact/send-mail',
    GET_BY_ID: (id: string | number) => `/contact/${id}`,
    DELETE: (id: string | number) => `/contact/${id}`,
}