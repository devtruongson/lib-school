export enum ROLE_APP_MANAGE {
    user = 'user',
    admin = 'admin',
}

enum URL_BASE_BACKEND {
    BASE_URL = 'https://lib.fstack.com.vn',
}

export enum ConfigEnum {
    URL_BE_CATE_GET_ALL = URL_BASE_BACKEND.BASE_URL + '/api/v1/cate',
    URL_BE_BOOK_GET_ALL = URL_BASE_BACKEND.BASE_URL + '/api/v1/book',
    URL_BE_USER_GET_ALL = URL_BASE_BACKEND.BASE_URL + '/api/v1/user',
}
