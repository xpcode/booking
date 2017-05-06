import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import { Toast } from 'antd-mobile'

import env from '../../helpers/env'
import ActionStatus from '../../constants/ActionStatus'
import { toJSON, auth, catchException, genAction, genFetchOptions } from '../../helpers/util'

const $$initialState = Immutable.fromJS({
})


export default ($$state = $$initialState, action) => {
  switch (action.type) {

    default:
      return $$state
  }
}

export const ACTION_GETRESTAURANTLIST = 'ACTION_GETRESTAURANTLIST'
export const ACTION_GETRESTAURANTLIST_SUCCEED = 'ACTION_GETRESTAURANTLIST_SUCCEED'
export const ACTION_GETRESTAURANTLIST_FAILURE = 'ACTION_GETRESTAURANTLIST_FAILURE'

export const getRestaurantList = ({ username, password }) => {
  return dispatch => {
    const url = env.HTTP_LOGIN
    const options = genFetchOptions('get')

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
