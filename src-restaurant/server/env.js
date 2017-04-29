import path from 'path'

export default {
  HTTP_SERVER_PORT: 8081,
  HTTP_SERVICE_BASEURL: 'http://localhost:8081/',
  HTTP_SCRIPT_BASEURL: 'http://localhost:8082',
  HTTP_SCRIPT_SUFFIX: '',
  HTTP_CONTENT_TYPE: 'application/json',

  LOG_DIR: path.join(__dirname, './logs'),
  LOG_LEVEL: 'debug',
  AUTH_WHITELIST: [
    '/login'
  ]
}
