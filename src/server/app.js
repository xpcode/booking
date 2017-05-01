import path from 'path'
import Koa from 'koa'
import serve from 'koa-static'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'

import router from './controllers'
import auth from './middlewares/auth'
import viewhook from './middlewares/viewhook'
import winston from './middlewares/winston'
import env from './env'

new Koa()
  .use(auth())
  .use(viewhook({ beautify: env.HTTP_HTML_BEAUTIFY }))
  .use(winston())
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(path.join(process.cwd(), 'src-restaurant/static')))
  .listen(env.HTTP_SERVER_PORT)

console.log(`listening on port ${env.HTTP_SERVER_PORT} -- ${process.env.NODE_ENV}`)
