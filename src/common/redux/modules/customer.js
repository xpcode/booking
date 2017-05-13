import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import { Toast } from 'antd-mobile'

import env from '../../helpers/env'
import ActionStatus from '../../constants/ActionStatus'
import { toJSON, auth, catchException, genAction, genFetchOptions, genLeast3MonthTimeRange } from '../../helpers/util'

const $$initialState = Immutable.fromJS({
  restaurantList: [],
  freeSeats: {}
})


export default ($$state = $$initialState, action) => {
  switch (action.type) {
    case ACTION_GETRESTAURANTLIST_SUCCEED:
      const freeSeats = {}
      // 状态  1:待预定 2:已预定 3:已确定 4:已取消
      action.payload.forEach(item => {
        const key = moment(item.mealtime, 'YYYYMMDDhhmmss').format('YYYYMMDD')
        if (item.status == 1) {
          freeSeats[key] = 'calendar-grid-item-11'

        } else if (!freeSeats[item.id]) {
          freeSeats[key] = 'calendar-grid-item-12'
        }
      })
      return $$state.set('freeSeats', freeSeats)

    case ACTION_GETFREESEATS_SUCCEED:
      return $$state.set('restaurantList', action.payload)

    default:
      return $$state
  }
}

export const ACTION_GETRESTAURANTLIST = 'ACTION_GETRESTAURANTLIST'
export const ACTION_GETRESTAURANTLIST_SUCCEED = 'ACTION_GETRESTAURANTLIST_SUCCEED'
export const ACTION_GETRESTAURANTLIST_FAILURE = 'ACTION_GETRESTAURANTLIST_FAILURE'

export const getRestaurantList = () => {
  return dispatch => {
    const url = env.HTTP_GET_RESTAURANTLIST
    const options = genFetchOptions('post')

    fetch(url, options)
      .then(toJSON, catchException)
      .then(function (json) {
        if (json.code === 200) {
          const list = json.data

          dispatch(genAction(ACTION_GETRESTAURANTLIST_SUCCEED, list))
        } else {
          dispatch(genAction(ACTION_GETRESTAURANTLIST_FAILURE))
          Toast.fail(json.message, 2)
        }
      })
  }
}

export const ACTION_GETFREESEATS = 'ACTION_GETFREESEATS'
export const ACTION_GETFREESEATS_SUCCEED = 'ACTION_GETFREESEATS_SUCCEED'
export const ACTION_GETFREESEATS_FAILURE = 'ACTION_GETFREESEATS_FAILURE'

export const getFreeSeats = (restaurantId) => {
  return (dispatch, getState) => {
    const url = env.HTTP_GET_TFREESEATS
    const { minTime, maxTime } = genLeast3MonthTimeRange()
    const options = genFetchOptions('post', {
      minTime,
      maxTime,
      restaurantId
    })

    fetch(url, options)
      .then(toJSON, catchException)
      .then(function (json) {
        if (json.code === 200) {
          const list = json.data

          dispatch(genAction(ACTION_GETFREESEATS_SUCCEED, list))
        } else {
          dispatch(genAction(ACTION_GETFREESEATS_FAILURE))
          Toast.fail(json.message, 2)
        }
      })
  }
}
