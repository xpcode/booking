import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import user from './modules/user'
import customer from './modules/customer'

export default combineReducers({
  routing,
  user,
  customer
})
