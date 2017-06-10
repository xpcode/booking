import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import Cookies from 'cookies-js'
import { Toast } from 'antd-mobile'
import md5 from 'md5'

import env from '../../helpers/env'
import ActionStatus from '../../constants/ActionStatus'
import { toJSON, auth, catchException, genAction, genFetchOptions } from '../../helpers/util'

const $$initialState = Immutable.fromJS({
    loginStatus: ActionStatus.READY,
    user: {}
})


export default ($$state = $$initialState, action) => {
    switch (action.type) {
        case ACTION_INIT:
            const userCooke = Cookies.get('user')
            const user = {}

            if (userCooke) {
                Object.assign(user, JSON.parse(decodeURIComponent(userCooke)))
            }
            return $$state.set('user', Immutable.fromJS(user))

        case ACTION_LOGIN:
            return $$state.set('loginStatus', ActionStatus.ING)

        case ACTION_LOGIN:
            return $$state.set('loginStatus', ActionStatus.ING)

        case ACTION_LOGIN_SUCCEED:
            return $$state
                .set('loginStatus', ActionStatus.SUCCEED)
                .set('user', action.payload)

        case ACTION_LOGIN_FAILURE:
            return $$state.set('loginStatus', ActionStatus.FAILURE)

        default:
            return $$state
    }
}

export const ACTION_INIT = 'ACTION_INIT'
export const ACTION_LOGIN = 'ACTION_LOGIN'
export const ACTION_LOGIN_SUCCEED = 'ACTION_LOGIN_SUCCEED'
export const ACTION_LOGIN_FAILURE = 'ACTION_LOGIN_FAILURE'

export const login = ({ username, password }) => {
    return async (dispatch, getState) => {
        const url = env.HTTP_LOGIN
        const options = genFetchOptions('post', {
            username,
            password: md5(password)
        })

        const json = await fetch(url, options).then(toJSON, catchException)

        if (json.code === 200) {
            const userInfo = json.data
            const userCooke = Cookies.get('user')
            const user = {}

            if (userCooke) {
                Object.assign(user, JSON.parse(decodeURIComponent(userCooke)))
            }

            dispatch(genAction(ACTION_LOGIN_SUCCEED, user))

            if (user.type === 1) {
                location.href = '/restaurant/schedule'
            } else if (user.type === 2) {
                location.href = '/customer/restaurants'
            }

        } else if (json.code === 201) {
            Toast.info('用户名或密码输入不正确', 2)

        } else {
            dispatch(genAction(ACTION_LOGIN_FAILURE))
            Toast.info(json.message || '登录失败', 2)
        }
    }
}
