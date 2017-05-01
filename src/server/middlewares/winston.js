import winston from 'winston'
import fs from 'fs'
import path from 'path'

import env from '../env'

if (!fs.existsSync(env.LOG_DIR)) {
  fs.mkdir(env.LOG_DIR)
}

export default function (winstonInstance) {
  if (!winstonInstance) {
    winstonInstance = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: env.LOG_LEVEL,
        }),
        new (winston.transports.File)({
          name: 'info-file',
          filename: path.join(env.LOG_DIR, `${env.LOG_LEVEL}.log`),
          level: env.LOG_LEVEL,
        }),
      ]
    })
  }
  return async function (ctx, next) {
    ctx.logger = winstonInstance
    await next()
  }
}
