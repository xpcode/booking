import path from 'path'
import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'

import router from './controllers'
import winston from './middlewares/winston'
import mysql from './middlewares/mysql'
import env from './env'

new Koa()
  .use(winston())
  .use(mysql())
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(env.HTTP_SERVER_PORT)

console.log(`listening on port ${env.HTTP_SERVER_PORT} -- ${process.env.NODE_ENV}`)
