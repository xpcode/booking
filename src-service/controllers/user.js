import env from '../env'

export default function (router) {

    /**
     * 登录
     * body: {"username":"earl","password":"f379eaf3c831b04de153469d1bec345e", "type": 1}
     */
    router.post('/user/login', async function (ctx) {
        const { request, logger, mysql } = ctx
        const { username, password } = request.body

        const where = `WHERE username="${username}" AND password="${password}"`
        const sql = `SELECT id, username, realname, restaurantIds, type FROM \`user\` ${where}`

        logger.debug(sql)

        const rows = await mysql.query(sql).catch(e => null)

        if (rows) {
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
        } else {
            ctx.body = {
                code: 500
            }
        }
    })

    return router

}
