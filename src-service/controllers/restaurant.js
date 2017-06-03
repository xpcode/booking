import moment from 'moment'
import { createConnection } from 'promise-mysql'

import env from '../env'

export default function (router) {

    router.post('/restaurants/restaurant/seats/add', async function (ctx) {
        const { request, logger } = ctx
        const { restaurantId, mealtime, seatcount, comments = '' } = request.body

        await createConnection(env.mysql)
            .then(conn => {
                const values = `VALUES (${restaurantId}, ${mealtime}, ${seatcount}, 1, '${comments}')`
                const sql = `INSERT INTO seat (restaurantId, mealtime, seatcount, status, comments) ${values}`

                logger.debug(sql)

                return conn.query(sql)

            }).then(({ insertId }) => {
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

            }).catch(error => {
                ctx.body = {
                    code: 500
                }
            })
    })

    router.post('/restaurants/restaurant/schedule', async function (ctx) {
        const { request, logger } = ctx
        const { minTime, maxTime, restaurantId } = request.body

        await createConnection(env.mysql)
            .then(conn => {
                const where = `WHERE ${minTime}<seat.mealtime AND seat.mealtime<${maxTime} AND seat.restaurantId=${restaurantId}`
                const sql = `SELECT DISTINCT seat.id, mealtime, seat.status status, order.status orderStatus FROM seat LEFT JOIN \`order\` ON seat.id=\`order\`.seatId ${where}`

                logger.debug(sql)

                return conn.query(sql)

            }).then(rows => {
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

            }).catch(error => {
                ctx.body = {
                    code: 500
                }
            })
    })

    router.post('/restaurants/restaurant/todolist', async function (ctx) {
        const { request, logger } = ctx
        const { date, restaurantId } = request.body
        const minTime = date + '000000'
        const maxTime = date + '235959'

        await createConnection(env.mysql)
            .then(conn => {
                const where = `WHERE ${minTime}<seat.mealtime AND seat.mealtime<${maxTime} AND seat.restaurantId=${restaurantId}`
                const sql = `SELECT DISTINCT seat.id, order.id orderId, order.contactname, seat.mealtime, seat.seatcount, seat.status seatStatus, order.status orderStatus, seat.comments FROM seat
LEFT JOIN \`order\` ON seat.id=order.seatId
LEFT JOIN \`user\` ON seat.userId=user.id ${where}`

                logger.debug(sql)

                return conn.query(sql)

            }).then(rows => {
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

            }).catch(error => {
                ctx.body = {
                    code: 500
                }
            })
    })

    router.post('/restaurant/seat/updatestatus', async function (ctx) {
        const { request, logger } = ctx
        const { seatId, status } = request.body

        await createConnection(env.mysql)
            .then(conn => {
                let sql = null

                if (status == 4) {
                    sql = `DELETE FROM seat WHERE id=${seatId}`
                } else {
                    sql = `UPDATE seat SET \`status\`=${status} WHERE id=${seatId}`
                }

                logger.debug(sql)

                return conn.query(sql)

            }).then(({ affectedRows }) => {
                if (affectedRows > 0) {
                    ctx.body = {
                        code: 200,
                    }
                } else {
                    ctx.body = {
                        code: 201
                    }
                }

            }).catch(error => {
                ctx.body = {
                    code: 500
                }
            })
    })

    router.post('/restaurant/order/updatestatus', async function (ctx) {
        const { request, logger } = ctx
        const { orderId, status } = request.body

        await createConnection(env.mysql)
            .then(conn => {
                let sql = `UPDATE \`order\` SET \`status\`=${status} WHERE id=${orderId}`

                logger.debug(sql)

                return conn.query(sql)

            }).then(({ affectedRows }) => {
                if (affectedRows > 0) {
                    ctx.body = {
                        code: 200,
                    }
                } else {
                    ctx.body = {
                        code: 201
                    }
                }

            }).catch(error => {
                ctx.body = {
                    code: 500
                }
            })
    })

    return router
}
