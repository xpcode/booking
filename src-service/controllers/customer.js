import moment from 'moment'

import env from '../env'
import { sendSms } from './sms'

export default function (router) {

    router.post('/customer/restaurants', async function (ctx) {
        const { request, logger, mysql } = ctx
        const mealtime = moment().format('YYYYMMDD000000')

        const where = `WHERE mealtime>${mealtime} and status=1`
        const sql = `SELECT DISTINCT restaurant.id, restaurant.name FROM restaurant INNER JOIN seat ON restaurant.id=seat.restaurantId ${where}`

        logger.debug(sql)

        const rows = await mysql.query(sql).catch(e => null)

        if (rows && rows.length >= 0) {
            ctx.body = {
                code: 200,
                data: rows
            }
        } else {
            ctx.body = {
                code: 201
            }
        }
    })

    router.post('/customer/restaurants/freeseats', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { minTime, maxTime, restaurantId } = request.body

        const where = `WHERE ${minTime}<mealtime AND mealtime<${maxTime} AND seat.restaurantId=${restaurantId} AND seat.status=1`
        const sql = `SELECT DISTINCT seat.id, mealtime, restaurantId, seatcount, status, userId, comments FROM seat LEFT JOIN \`user\` ON seat.userId=user.id ${where}`

        logger.debug(sql)

        const rows = await mysql.query(sql).catch(e => null)

        if (rows && rows.length >= 0) {
            ctx.body = {
                code: 200,
                data: rows
            }
        } else {
            ctx.body = {
                code: 201
            }
        }
    })

    router.post('/customer/restaurants/timelist', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { mealtime, restaurantId } = request.body
        const minTime = mealtime + '000000'
        const maxTime = mealtime + '235959'

        const where = `WHERE ${minTime}<mealtime AND mealtime<${maxTime} AND restaurantId=${restaurantId}`
        const sql = `SELECT DISTINCT id, mealtime FROM seat ${where}`

        logger.debug(sql)

        const rows = await mysql.query(sql).catch(e => null)

        if (rows.length >= 0) {
            ctx.body = {
                code: 200,
                data: rows
            }
        } else {
            ctx.body = {
                code: 201
            }
        }
    })

    router.post('/customer/myorders', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { userId } = request.body

        const where = `WHERE o.userId=${userId}`
        const sql = `SELECT o.id, o.contactname, o.contactmobile, o.status, restaurant.name restaurantName, seat.mealtime, seat.seatcount, seat.comments
FROM \`order\` o INNER JOIN seat ON o.seatId=seat.id INNER JOIN restaurant ON restaurant.id=seat.restaurantId ${where}`

        logger.debug(sql)

        const rows = await mysql.query(sql).catch(e => null)

        if (rows.length >= 0) {
            ctx.body = {
                code: 200,
                data: rows
            }
        } else {
            ctx.body = {
                code: 201
            }
        }
    })

    router.post('/customer/addorder', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { seatId, contactname, contactmobile, contactinfo } = request.body
        const createtime = moment().format('YYYYMMDDhhmmss')

        const values = `VALUES (${seatId}, '${contactname}', ${contactmobile}, '${contactinfo}', ${createtime}, 1)`
        let sql = `INSERT INTO \`order\` (seatId, contactname, contactmobile, contactinfo, createtime, \`status\`) ${values}`

        logger.debug(sql)

        const { insertId } = await mysql.query(sql).catch(e => ({ insertId: 0 }))

        if (insertId === 0) {
            ctx.body = {
                code: 201
            }
            return
        }


        // 更新坐席状态
        sql = `UPDATE seat SET \`status\`=2 WHERE id=${seatId}`
        logger.debug(sql)

        const { affectedRows } = await mysql.query(sql).catch(e => ({ affectedRows: 0 }))

        if (affectedRows > 0) {
            ctx.body = {
                code: 200,
            }
        } else {
            ctx.body = {
                code: 201
            }
        }
    })

    return router
}
