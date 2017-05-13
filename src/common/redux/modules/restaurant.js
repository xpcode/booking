import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import { Toast } from 'antd-mobile'

import env from '../../helpers/env'
import ActionStatus from '../../constants/ActionStatus'
import { toJSON, auth, catchException, genAction, genFetchOptions } from '../../helpers/util'

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

        } else if (!schedule[item.id]) {
          schedule[key] = 'calendar-grid-item-12'
        }
      })
      return $$state.set('schedule', schedule)

    case ACTION_GET_TODOLIST_SUCCEED:
      return $$state.set('todoList', action.payload)

    case ACTION_UPDATE_SEATSTATUS_SUCCEED:
      return $$state.update('todoList', todoList => {
        return todoList.map(item => {
          if (item.id === action.payload.seatId) {
            item.status = action.payload.status
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
          Toast.fail(json.message, 2)
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
          Toast.fail(json.message, 2)
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
          Toast.fail(json.message, 2)
        }
      })
  }
}

export const ACTION_UPDATE_SEATSTATUS = 'ACTION_UPDATE_SEATSTATUS'
export const ACTION_UPDATE_SEATSTATUS_SUCCEED = 'ACTION_UPDATE_SEATSTATUS_SUCCEED'
export const ACTION_UPDATE_SEATSTATUS_FAILURE = 'ACTION_UPDATE_SEATSTATUS_FAILURE'

export const updateStatus = (seatId, status) => {
  return (dispatch, getState) => {
    const url = env.HTTP_UPDATE_SEAT_STATUS
    const options = genFetchOptions('post', {
      seatId,
      status
    })

    return fetch(url, options)
      .then(toJSON, catchException)
      .then(function (json) {
        if (json.code === 200) {
          dispatch(genAction(ACTION_UPDATE_SEATSTATUS_SUCCEED, {
            seatId,
            status
          }))
        } else {
          dispatch(genAction(ACTION_UPDATE_SEATSTATUS_FAILURE))
          Toast.fail(json.message, 2)
        }
      })
  }
}
