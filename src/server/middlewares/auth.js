import env from '../env'

export default function (routes) {
  return async function (ctx, next) {
    const { path, cookies } = ctx

    for (let item of env.AUTH_WHITELIST) {
      if (item instanceof RegExp) {
        if (item.test(path)) {
          return await next()
        }
      } else if (item === path) {
        return await next()
      }
    }
    const userCooke = cookies.get('user')
    const redirectLogin = ctx => {
      if (ctx.is(env.HTTP_CONTENT_TYPE.JSON)) {
        ctx.body = {
          code: 401
        }
      } else {
        ctx.redirect('/login')
      }
    }
    if (userCooke) {
      try {
        // token的有效性在页面controller校验
        ctx.user = JSON.parse(decodeURIComponent(userCooke))
        try {
          return await next()
        } catch (e) {
          ctx.logger.error(`KOA2：controller程序内部错误（${e}）`)
        }

      } catch (e) {
        redirectLogin(ctx)

      } finally {
        if (!ctx.user) {
          redirectLogin(ctx)
        }
      }
    } else {
      redirectLogin(ctx)
    }
  }
};
