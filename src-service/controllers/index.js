import Router from 'koa-router'

const router = Router()
export default router


require('./user').default(router)
require('./customer').default(router)
require('./restaurant').default(router)
