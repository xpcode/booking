import Router from 'koa-router'
import fetch from 'isomorphic-fetch'

import env, { combine } from './env'
import { genFetchOptions, toJSON, catchException } from '../common/helpers/util'

const router = Router()
export default router


router.get('/login', function (ctx) {
  ctx.render({
    title: '登录'
  })
})

router.get('/', function (ctx) {
  const userCooke = ctx.cookies.get('user')
  const user = {}

  if (userCooke) {
    Object.assign(user, JSON.parse(decodeURIComponent(userCooke)))
  }

  if (!user.type) {
    ctx.redirect('/login')
  }
  if (user.type === 1) {
    ctx.redirect('/restaurant')

  } else if (user.type === 2) {
    ctx.redirect('/customer')
  }
})

router.get('/restaurant', function (ctx) {
  ctx.render({
    title: '最新开放席位'
  })
})





const UNSURE_ROUTE = '/api-unsure/*'

router.all(UNSURE_ROUTE, async function doUnsureHttpRequest(ctx) {
  const { req, res, request, response } = ctx
  const url = combine(env.HTTP_SERVICE_BASEURL, req.url.substr(UNSURE_ROUTE.length - 1))
  const headers = {
    'content-type': env.HTTP_CONTENT_TYPE,
    origin: 'koa2 server',
    cookie: req.headers.cookie
  }
  const options = genFetchOptions(req.method, headers, request.body)

  ctx.logger.info(`参数：${JSON.stringify(request.body)}`)

  await fetch(url, options)
    .then(toJSON, catchException)
    .then(json => {
      ctx.type = env.HTTP_CONTENT_TYPE
      ctx.body = json
      if (json.code === 500) {
        ctx.logger.error(`【接口】${url} 【异常】${json.message}`)
      }
    })
})

router.all('/api/login', async function doUnsureHttpRequest(ctx) {
  const { req, res, request, response } = ctx
  const url = combine(env.HTTP_SERVICE_BASEURL, env.HTTP_USER_LOGIN_URL)
  const headers = {
    'content-type': env.HTTP_CONTENT_TYPE,
    origin: 'koa2 server',
    cookie: req.headers.cookie
  }
  const options = genFetchOptions(req.method, headers, request.body)

  ctx.logger.info(`参数：${JSON.stringify(request.body)}`)

  await fetch(url, options)
    .then(toJSON, catchException)
    .then(json => {
      ctx.type = env.HTTP_CONTENT_TYPE
      ctx.body = json

      if (json.code === 200) {
        const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000)

        ctx.cookies.set('user', encodeURIComponent(JSON.stringify(json.data)), {
          path: '/',
          expires,
          httpOnly: false,
        })
      } else if (json.code === 500) {
        ctx.logger.error(`【接口】${url} 【异常】${json.message}`)
      }
    })
})

