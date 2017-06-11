import moment from 'moment'

import env from '../env'
import { sendSms } from './sms'

export default function (router) {

    router.post('/customer/restaurants', async function (ctx) {
        const { request, logger, mysql } = ctx
        const mealtime = moment().format('YYYYMMDD000000')

        const where = `WHERE mealtime>${mealtime} and status<=2 ORDER BY seat.createtime DESC`
        const sql = `SELECT DISTINCT restaurant.id, restaurant.name, seat.mealtime, seat.createtime FROM restaurant INNER JOIN seat ON restaurant.id=seat.restaurantId ${where}`

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

        const where = `WHERE ${minTime}<mealtime AND mealtime<${maxTime} AND seat.restaurantId=${restaurantId} AND seat.status<=2`
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

        const where = `WHERE ${minTime}<s.mealtime AND s.mealtime<${maxTime} AND s.status<3 AND s.restaurantId=${restaurantId}`
        const sql = `SELECT DISTINCT s.id, s.mealtime, s.seatcount, r.name restaurantName FROM seat s INNER JOIN restaurant r ON s.restaurantId=r.id ${where}`

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

        const where = `WHERE o.userId=${userId} ORDER BY seat.mealtime`
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
        const { seatId, userId, contactname, contactmobile, contactinfo } = request.body
        const createtime = moment().format('YYYYMMDDhhmmss')

        const values = `VALUES (${seatId}, ${userId}, '${contactname}', ${contactmobile}, '${contactinfo}', ${createtime}, 1)`
        let sql = `INSERT INTO \`order\` (seatId, userId, contactname, contactmobile, contactinfo, createtime, \`status\`) ${values}`

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


        // 获取预订信息，给餐馆发短信
        sql = `SELECT r.mobilePhone, s.mealtime, s.seatcount FROM seat s INNER JOIN restaurant r ON s.restaurantId=r.id WHERE s.id=${seatId}`
        logger.debug(sql)

        const list = await mysql.query(sql).catch(e => null)
        if (list && list.length > 0) {
            const {
                mealtime,
                seatcount,
                mobilePhone
            } = list[0]
            const dtstr = moment(mealtime, 'YYYYMMDDhhmmss').format('YYYY年MM月DD日')
            const datestr = moment(mealtime, 'YYYYMMDDhhmmss').format('YYYYMMDD')

            // 发送短信
            const smsMessage = `有新预订，${dtstr}，${seatcount}人，查看详情：http://sing.fish/restaurant/schedule/${datestr}  【sing.fish】`
            logger.debug(mobilePhone, smsMessage)

            const { errorCode, message, messageId, exceptionType, exceptionMessage } = await sendSms(mobilePhone, smsMessage)
            logger.debug(errorCode, message, messageId, exceptionType, exceptionMessage)
        }


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
