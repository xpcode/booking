import path from 'path'

export default {
  HTTP_SERVER_PORT: 8081,

  LOG_DIR: path.join(__dirname, './logs'),
  LOG_LEVEL: 'debug',

  mysql: {
    host: 'localhost',
    user: 'root',
    password: '666666',
    database: 'booking',
    port: 3306,
  }
}
