import moment from 'moment'
import { createConnection } from 'promise-mysql'

import env from '../env'

export default function (router) {

  router.post('/customer/restaurants', async function (ctx) {
    const { request, logger } = ctx

    await createConnection(env.mysql)
      .then(conn => {
        const mealtime = moment().format('YYYYMMDD000000')

        const where = `WHERE mealtime>${mealtime} and status=1`
        const sql = `SELECT DISTINCT restaurant.id, restaurant.name FROM restaurant INNER JOIN seat ON restaurant.id=seat.restaurantId ${where}`

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

  router.post('/customer/restaurants/freeseats', async function (ctx) {
    const { request, logger } = ctx
    const { minTime, maxTime, restaurantId } = request.body

    await createConnection(env.mysql)
      .then(conn => {
        const where = `WHERE ${minTime}<mealtime AND mealtime<${maxTime} AND seat.restaurantId=${restaurantId} AND seat.status=1`
        const sql = `SELECT DISTINCT seat.id, mealtime, restaurantId, seatcount, status, userId, comments FROM seat LEFT JOIN \`user\` ON seat.userId=user.id ${where}`

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

  router.post('/customer/restaurants/timelist', async function (ctx) {
    const { request, logger } = ctx
    const { mealtime, restaurantId } = request.body
    const minTime = mealtime + '000000'
    const maxTime = mealtime + '235959'

    await createConnection(env.mysql)
      .then(conn => {
        const where = `WHERE ${minTime}<mealtime AND mealtime<${maxTime} AND restaurantId=${restaurantId}`
        const sql = `SELECT DISTINCT id, mealtime FROM seat ${where}`

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

  router.post('/customer/addorder', async function (ctx) {
    const { request, logger } = ctx
    const { seatId, contactname, contactmobile, contactinfo } = request.body
    const createtime = moment().format('YYYYMMDDhhmmss')

    await createConnection(env.mysql)
      .then(conn => {
        const values = `VALUES (${seatId}, '${contactname}', ${contactmobile}, '${contactinfo}', ${createtime}, 1)`
        const sql = `INSERT INTO \`order\` (seatId, contactname, contactmobile, contactinfo, createtime, \`status\`) ${values}`

        logger.debug(sql)

        return conn.query(sql)

      }).then(({ insertId }) => {
        if (insertId > 0) {
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
