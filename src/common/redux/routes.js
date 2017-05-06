import React from 'react'
import { Route, IndexRoute } from 'react-router'

import {
  Login,
  MasterAdaptor,
  RestaurantList,
  Order
} from '../containers'

export default (
  <Route>
    <Route path="login" component={Login} />
    <Route path="/" component={MasterAdaptor}>
      <Route path="restaurant" component={RestaurantList} />
    </Route>
  </Route>
)
