import React from 'react'
import { Route, IndexRoute } from 'react-router'

import {
  Login,
  MasterAdaptor,
  RestaurantSchedule,
  RestaurantAddSeat,
  RestaurantTodoList,
  RestaurantList,
  FreeSeats,
  Order,
  MyOrders,
} from '../containers'

export default (
  <Route>
    <Route path="login" component={Login} />
    <Route path="/" component={MasterAdaptor}>
      <Route path="restaurant">
        <Route path="schedule" component={RestaurantSchedule} />
        <Route path="schedule/:mealtime" component={RestaurantTodoList} />
        <Route path="seats">
          <Route path="add" component={RestaurantAddSeat} />
          <Route path="add/:mealtime" component={RestaurantAddSeat} />
        </Route>
      </Route>
      <Route path="customer">
        <Route path="restaurants" component={RestaurantList} />
        <Route path="restaurants/:restaurantId" component={FreeSeats} />
        <Route path="restaurants/:restaurantId/:mealtime" component={Order} />
        <Route path="orders" component={MyOrders} />
      </Route>
    </Route>
  </Route>
)
