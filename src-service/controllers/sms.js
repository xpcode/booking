import fetch from 'isomorphic-fetch'

import { toJSON, catchException } from '../util'

export const sendSms = (to, message) => {
    const url = `https://messagingapi.sinch.com/v1/sms/{to}`
    const Authorization = `basic YXBwbGljYXRpb25cMWQ0YTQ3NWMtOGI4NS00MzEyLWFjMzItYTk0Y2YzYjJlZTQ1OlJmaFJDYlZNa0VlenJGNTQvQUNLNXc9PQ==`
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization
        },
        body: JSON.stringify({
            from: '19177087126',
            message
        }),
        credentials: 'include',
    }

    return fetch(url, options).then(toJSON, catchException)
}

export default function (router) {

    router.post('/sendsms', async ctx => {
        const { request, logger } = ctx
        const { to, message } = request.body

        await sendSms(to, message).then(function ({ errorCode, message, messageId, exceptionType, exceptionMessage }) {
            if (messageId && messageId > 0) {
                ctx.body = {
                    code: 200,
                    data: messageId
                }
            } else if (exceptionType && exceptionMessage) {
                ctx.body = {
                    code: 401,
                    data: {
                        exceptionType,
                        exceptionMessage
                    }
                }
            } else if (errorCode) {
                ctx.body = {
                    code: errorCode,
                    data: message
                }
            } else {
                ctx.body = {
                    code: 500
                }
            }
        })
    })

    return router
}
