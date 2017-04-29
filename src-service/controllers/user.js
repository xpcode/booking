import env from '../env'
import { createConnection } from 'promise-mysql'

export default function (router) {

  /**
   * 登录
   * body: {"username":"earl","password":"f379eaf3c831b04de153469d1bec345e", "type": 1}
   */
  router.post('/user/login', async function (ctx) {
    const { request, logger } = ctx
    const { username, password, type } = request.body

    await createConnection(env.mysql)
      .then(conn => {
        const where = `where username="${username}" and password="${password}" and type="${type}"`
        const sql = `select id, username, realname, restaurantIds from user ${where}`

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
