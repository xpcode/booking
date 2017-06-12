import path from 'path'

const config = {
    HTTP_SERVER_PORT: 8080,

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

if (process.env.NODE_ENV === 'production') {
    config.mysql = {
        host: 'localhost',
        user: 'root',
        password: 'Zhangcheng2017!',
        database: 'booking',
        port: 3306,
    }
}

export default config
