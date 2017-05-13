import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import user from './modules/user'
import customer from './modules/customer'
import restaurant from './modules/restaurant'

export default combineReducers({
  routing,
  user,
  customer,
  restaurant
})
