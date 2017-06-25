import path from 'path'

const config = {
    HTTP_SERVER_PORT: 8081,
    HTTP_SERVICE_BASEURL: 'http://localhost:8080/',
    HTTP_SCRIPT_BASEURL: 'http://localhost:8082/static',
    HTTP_USER_LOGIN_URL: 'user/login',
    HTTP_SCRIPT_SUFFIX: '',
    HTTP_CONTENT_TYPE: 'application/json',

    LOG_DIR: path.join(__dirname, './logs'),
    LOG_LEVEL: 'debug',
    AUTH_WHITELIST: [
        '/login',
        '/logout',
        '/api/login',
        /\.(html|htm|js|css|png|gif|svg|eot|ttf|woff|woff2)$/,
    ]
}

if (process.env.NODE_ENV === 'production') {
    config.HTTP_SCRIPT_BASEURL = 'http://sing.fish'
    config.LOG_LEVEL = 'error'
}

export default config

export function combine(baseurl, pathname) {
    const separator = (/\/$/.test(baseurl) === false && /^\//.test(pathname) === false) ? '/' : ''
    return Array.prototype.slice.call(arguments, 0).join(separator)
}
