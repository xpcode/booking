import Router from 'koa-router'

const router = Router()
export default router

router.get('/', function (ctx) {
  ctx.render({

  })
})

router.get('/login', function (ctx) {console.log(9)
  ctx.render({

  })
})
