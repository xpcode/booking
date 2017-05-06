import moment from 'moment'

export default function (router) {

  router.get('/restaurants', async function (ctx) {
    const { request, logger } = ctx

    await createConnection(env.mysql)
      .then(conn => {
        const now = new Date()
        const month = now.getMonth() + 3
        const newTime = new Date(now.setDate(1)).setMonth(month)
        const mealtime = moment(newTime).format('YYYYMMDD000000')

        const where = `where mealtime<${mealtime} and status=1`
        const sql = `select DISTINCT restaurant.id, restaurant.name from restaurant inner join seat on restaurant.id=seat.restaurantId ${where}`

        logger.debug(sql)

        return conn.query(sql)

      }).then(rows => {
        if (rows.length > 0) {
          ctx.body = {
            code: 200,
            data: rows[0]
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

  router.get('/restaurants/restaurant', async function (ctx) {
    const { request, logger } = ctx
    const { restaurantId, userId, status, mealtime, seatcount, comments } = request.body

    await createConnection(env.mysql)
      .then(conn => {
        const values = `${restaurantId}, ${userId}, ${status}, ${mealtime}, ${seatcount}, '${comments}'`
        const sql = `insert into seat (restaurantId, userId, status, mealtime, seatcount, comments) values (${values})`

        logger.debug(sql)

        return conn.query(sql)

      }).then(rows => {
        if (rows.length > 0) {
          ctx.body = {
            code: 200,
            data: rows[0]
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
