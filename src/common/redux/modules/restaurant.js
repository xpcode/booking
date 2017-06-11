import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import { Toast } from 'antd-mobile'

import env from '../../helpers/env'
import ActionStatus from '../../constants/ActionStatus'
import { toJSON, auth, catchException, genAction, genFetchOptions, genLeast3MonthTimeRange } from '../../helpers/util'

const $$initialState = Immutable.fromJS({
    schedule: {},
    todoList: []
})


export default ($$state = $$initialState, action) => {
    switch (action.type) {
        case ACTION_GET_SCHEDULE_SUCCEED:
            const schedule = {}
            // 状态  1:待预定 2:已预定 3:已确定 4:已取消
            action.payload.forEach(item => {
                const key = moment(item.mealtime, 'YYYYMMDDhhmmss').format('YYYYMMDD')
                if (item.status == 1) {
                    schedule[key] = 'calendar-grid-item-11'

                } else if (item.status == 2) {
                    schedule[key] = 'calendar-grid-item-12'

                } else if (item.status == 3) {
                    schedule[key] = 'calendar-grid-item-13'
                }

                if (item.orderStatus == 1) {
                    schedule[key] = 'calendar-grid-item-12'

                } else if (item.orderStatus == 2) {
                    schedule[key] = 'calendar-grid-item-13'
                }
            })
            return $$state.set('schedule', schedule)

        case ACTION_GET_TODOLIST_SUCCEED:
            return $$state.set('todoList', action.payload)

        case ACTION_UPDATE_SEATSTATUS_CANCEL_SUCCEED:
            return $$state.update('todoList', todoList => {
                return todoList.map(item => {
                    if (item.id === action.payload) {
                        item.seatStatus = 4
                    }
                    return item
                })
            })

        case ACTION_UPDATE_ORDERSTATUS_CONFIRM_SUCCEED:
            return $$state.update('todoList', todoList => {
                return todoList.map(item => {
                    if (item.id == action.payload.seatId) {
                        item.seatStatus = 3
                    }
                    if (item.orderId == action.payload.orderId) {
                        item.orderStatus = 2
                    }
                    return item
                })
            })

        default:
            return $$state
    }
}

export const ACTION_ADD_SEAT = 'ACTION_ADD_SEAT'
export const ACTION_ADD_SEAT_SUCCEED = 'ACTION_ADD_SEAT_SUCCEED'
export const ACTION_ADD_SEAT_FAILURE = 'ACTION_ADD_SEAT_FAILURE'

export const addSeat = (seatInfo) => {
    return dispatch => {
        const url = env.HTTP_ADD_SEAT
        const options = genFetchOptions('post', {
            restaurantId: seatInfo.restaurantId,
            mealtime: seatInfo.date.format('YYYYMMDD') + seatInfo.time.format('hhmmss'),
            seatcount: seatInfo.count,
            comments: seatInfo.comments
        })

        return fetch(url, options)
            .then(toJSON, catchException)
            .then(function (json) {
                if (json.code === 200) {
                    const list = json.data

                    dispatch(genAction(ACTION_ADD_SEAT_SUCCEED, list))
                } else {
                    dispatch(genAction(ACTION_ADD_SEAT_FAILURE))
                    Toast.info('添加席位失败', 2)
                }
            })
    }
}

export const ACTION_GET_SCHEDULE = 'ACTION_GET_SCHEDULE'
export const ACTION_GET_SCHEDULE_SUCCEED = 'ACTION_GET_SCHEDULE_SUCCEED'
export const ACTION_GET_SCHEDULE_FAILURE = 'ACTION_GET_SCHEDULE_FAILURE'

export const getSchedule = (seatInfo) => {
    return (dispatch, getState) => {
        const url = env.HTTP_GET_SCHEDULE
        const { minTime, maxTime } = genLeast3MonthTimeRange()
        const restaurantId = getState().user.getIn(['user', 'restaurantIds'])
        const options = genFetchOptions('post', {
            minTime,
            maxTime,
            restaurantId
        })

        return fetch(url, options)
            .then(toJSON, catchException)
            .then(function (json) {
                if (json.code === 200) {
                    const list = json.data || []

                    dispatch(genAction(ACTION_GET_SCHEDULE_SUCCEED, list))
                } else {
                    dispatch(genAction(ACTION_GET_SCHEDULE_FAILURE))
                    Toast.info(json.message || '请求失败', 2)
                }
            })
    }
}

export const ACTION_GET_TODOLIST = 'ACTION_GET_TODOLIST'
export const ACTION_GET_TODOLIST_SUCCEED = 'ACTION_GET_TODOLIST_SUCCEED'
export const ACTION_GET_TODOLIST_FAILURE = 'ACTION_GET_TODOLIST_FAILURE'

export const getTodoList = (date) => {
    return (dispatch, getState) => {
        const url = env.HTTP_GET_TODOLIST
        const restaurantId = getState().user.getIn(['user', 'restaurantIds'])

        const options = genFetchOptions('post', {
            date,
            restaurantId
        })

        return fetch(url, options)
            .then(toJSON, catchException)
            .then(function (json) {
                if (json.code === 200) {
                    const list = json.data || []

                    dispatch(genAction(ACTION_GET_TODOLIST_SUCCEED, list))
                } else {
                    dispatch(genAction(ACTION_GET_TODOLIST_FAILURE))
                    Toast.info(json.message || '请求失败', 2)
                }
            })
    }
}

export const ACTION_UPDATE_SEATSTATUS_CANCEL = 'ACTION_UPDATE_SEATSTATUS_CANCEL'
export const ACTION_UPDATE_SEATSTATUS_CANCEL_SUCCEED = 'ACTION_UPDATE_SEATSTATUS_CANCEL_SUCCEED'
export const ACTION_UPDATE_SEATSTATUS_CANCEL_FAILURE = 'ACTION_UPDATE_SEATSTATUS_CANCEL_FAILURE'

export const cancelSeat = (seatId) => {
    return (dispatch, getState) => {
        const url = env.HTTP_UPDATE_SEAT_CANCEL
        const options = genFetchOptions('post', { seatId })

        return fetch(url, options)
            .then(toJSON, catchException)
            .then(function (json) {
                if (json.code === 200) {
                    dispatch(genAction(ACTION_UPDATE_SEATSTATUS_CANCEL_SUCCEED, seatId))
                } else {
                    dispatch(genAction(ACTION_UPDATE_SEATSTATUS_CANCEL_FAILURE))
                    Toast.info(json.message || '请求失败', 2)
                }
            })
    }
}

export const ACTION_UPDATE_ORDERSTATUS_CONFIRM = 'ACTION_UPDATE_ORDERSTATUS_CONFIRM'
export const ACTION_UPDATE_ORDERSTATUS_CONFIRM_SUCCEED = 'ACTION_UPDATE_ORDERSTATUS_CONFIRM_SUCCEED'
export const ACTION_UPDATE_ORDERSTATUS_CONFIRM_FAILURE = 'ACTION_UPDATE_ORDERSTATUS_CONFIRM_FAILURE'

export const confirmOrder = (orderId, seatId, userId) => {
    return (dispatch, getState) => {
        const url = env.HTTP_UPDATE_ORDER_CONFIRM
        const options = genFetchOptions('post', { orderId, seatId, userId })

        return fetch(url, options)
            .then(toJSON, catchException)
            .then(function (json) {
                if (json.code === 200) {
                    dispatch(genAction(ACTION_UPDATE_ORDERSTATUS_CONFIRM_SUCCEED, { orderId, seatId }))
                } else {
                    dispatch(genAction(ACTION_UPDATE_ORDERSTATUS_CONFIRM_FAILURE))
                    Toast.info('更新订单状态失败', 2)
                }
            })
    }
}
