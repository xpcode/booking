import moment from 'moment'

import env from '../env'
import { sendSms } from './sms'

export default function (router) {

    /**
     * 增加席位
     */
    router.post('/restaurants/restaurant/seats/add', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { restaurantId, mealtime, seatcount, comments = '' } = request.body

        const values = `VALUES (${restaurantId}, ${mealtime}, ${seatcount}, 1, '${comments}')`
        const sql = `INSERT INTO seat (restaurantId, mealtime, seatcount, status, comments) ${values}`

        logger.debug(sql)

        const { insertId } = await mysql.query(sql).catch(e => ({ insertId: 0 }))

        if (insertId > 0) {
            ctx.body = {
                code: 200,
                data: insertId
            }
        } else {
            ctx.body = {
                code: 201
            }
        }
    })

    /**
     * 席位排期
     */
    router.post('/restaurants/restaurant/schedule', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { minTime, maxTime, restaurantId } = request.body

        const where = `WHERE ${minTime}<seat.mealtime AND seat.mealtime<${maxTime} AND seat.restaurantId=${restaurantId}`
        const sql = `SELECT DISTINCT seat.id, mealtime, seat.status status, order.status orderStatus FROM seat LEFT JOIN \`order\` ON seat.id=\`order\`.seatId ${where}`

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

    /**
     * todolist
     */
    router.post('/restaurants/restaurant/todolist', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { date, restaurantId } = request.body
        const minTime = date + '000000'
        const maxTime = date + '235959'

        const where = `WHERE ${minTime}<seat.mealtime AND seat.mealtime<${maxTime} AND seat.restaurantId=${restaurantId}`
        const sql = `SELECT DISTINCT seat.id, order.id userId, order.id orderId, order.contactname, order.contactmobile, seat.mealtime, seat.seatcount, seat.status seatStatus, seat.comments, order.status orderStatus, seat.comments FROM seat
LEFT JOIN \`order\` ON seat.id=order.seatId
LEFT JOIN \`user\` ON seat.userId=user.id ${where}`

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

    /**
     * 取消席位
     */
    router.post('/restaurant/seat/cancel', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { seatId } = request.body

        let sql = `SELECT o.id orderId, o.status, r.name restaurantName, s.mealtime, s.seatcount, o.contactmobile FROM \`order\` o INNER JOIN seat s ON o.seatId=s.id INNER JOIN restaurant r ON s.restaurantId=r.id WHERE s.id=${seatId}`
        logger.debug(sql)

        const rows = await mysql.query(sql).catch(e => null) || []
        const orderIds = []

        for (const item of rows) {
            if (item.status == 2) {
                ctx.body = {
                    code: 201
                }
                return
            }
            orderIds.push(item.orderId)
        }
        logger.debug(rows)

        sql = `DELETE FROM seat WHERE id=${seatId}`
        logger.debug(sql)

        const { affectedRows } = await mysql.query(sql).catch(e => ({ affectedRows: 0 }))

        sql = `UPDATE \`order\` SET status=4 WHERE id in (${orderIds.join(',')})`
        logger.debug(sql)

        const setOrderCount = await mysql.query(sql).catch(e => ({ affectedRows: 0 }))
        logger.debug(setOrderCount)

        for (const item of rows) {
            if (item.status == 1) {
                const {
                    restaurantName,
                    mealtime,
                    seatcount,
                    contactmobile
                    } = item
                const dtstr = moment(item.mealtime, 'YYYYMMDDhhmmss').format('YYYY年MM月DD日')

                // 发送短信
                const smsMessage = `很抱歉，您的预订被餐厅取消，${restaurantName}，${dtstr}，${seatcount}人，查看详情：http://sing.fish/customer/myorders 【sing.fish】`
                logger.debug(contactmobile, smsMessage)

                const { errorCode, message, messageId, exceptionType, exceptionMessage } = await sendSms(contactmobile, smsMessage)
                logger.debug(errorCode, message, messageId, exceptionType, exceptionMessage)
            }
        }

        ctx.body = {
            code: 200
        }
    })

    /**
     * 订单确认
     */
    router.post('/restaurant/order/confirm', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { orderId, seatId, userId } = request.body

        // 更新订单状态
        let sql = `UPDATE \`order\` SET \`status\`=2 WHERE id=${orderId}`
        logger.debug(sql)

        const { affectedRows } = await mysql.query(sql).catch(e => ({ affectedRows: 0 }))

        if (affectedRows === 0) {
            ctx.body = {
                code: 201
            }
            return
        }

        // 更新坐席状态
        sql = `UPDATE seat SET \`status\`=3, userId=${userId} WHERE id=${seatId}`
        logger.debug(sql)

        const result = await mysql.query(sql).catch(e => ({ affectedRows: 0 }))

        if (result.affectedRows === 0) {
            ctx.body = {
                code: 201
            }
            return
        }


        // 获取订单信息，给用户发短信用
        sql = `SELECT r.name restaurantName, s.mealtime, s.seatcount, o.contactmobile FROM \`order\` o INNER JOIN seat s ON o.seatId=s.id INNER JOIN restaurant r ON s.restaurantId=r.id WHERE o.id=${orderId}`
        logger.debug(sql)

        const orders = await mysql.query(sql).catch(e => null)
        if (orders && orders.length > 0) {
            const {
                restaurantName,
                mealtime,
                seatcount,
                contactmobile
            } = orders[0]
            const dtstr = moment(mealtime, 'YYYYMMDDhhmmss').format('YYYY年MM月DD日')

            // 发送短信
            const smsMessage = `您的预订已被餐厅确认，${restaurantName}，${dtstr}，${seatcount}人，查看详情：http://sing.fish/customer/myorders 【sing.fish】`
            logger.debug(contactmobile, smsMessage)

            const { errorCode, message, messageId, exceptionType, exceptionMessage } = await sendSms(contactmobile, smsMessage)
            logger.debug(errorCode, message, messageId, exceptionType, exceptionMessage)
        }


        // 更新该坐席的其他订单状态
        sql = `UPDATE \`order\` SET \`status\`=4 WHERE id!=${orderId} AND seatId=${seatId}`
        logger.debug(sql)

        await mysql.query(sql).catch(e => ({ affectedRows: 0 }))

        ctx.body = {
            code: 200
        }
    })

    return router
}
