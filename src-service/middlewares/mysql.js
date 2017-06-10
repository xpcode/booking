import { createPool } from 'promise-mysql'

import env from '../env'

export default function (winstonInstance) {
    return async function (ctx, next) {
        ctx.mysql = ctx.mysql || createPool(env.mysql)
        await next()
    }
}
