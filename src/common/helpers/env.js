export default {
  HTTP_CONTENT_TYPE: {
    JSON: 'application/json',
    FORM: 'multipart/form-data',
  },

  HTTP_LOGIN: '/api/login',
  HTTP_ADD_SEAT: gen('restaurants/restaurant/seats/add'),
  HTTP_UPDATE_SEAT_CANCEL: gen('restaurant/seat/cancel'),
  HTTP_UPDATE_ORDER_CONFIRM: gen('restaurant/order/confirm'),
  HTTP_GET_SCHEDULE: gen('restaurants/restaurant/schedule'),
  HTTP_GET_TODOLIST: gen('restaurants/restaurant/todolist'),
  HTTP_GET_RESTAURANTLIST: gen('customer/restaurants'),
  HTTP_GET_TFREESEATS: gen('customer/restaurants/freeseats'),
  HTTP_GET_TIMELIST: gen('customer/restaurants/timelist'),
  HTTP_ADD_ORDER: gen('customer/addorder'),
  HTTP_GET_MYORDERLIST: gen('customer/myorders'),
}

export function combine(baseurl, pathname) {
  const separator = (/\/$/.test(baseurl) === false && /^\//.test(pathname) === false) ? '/' : ''
  return Array.prototype.slice.call(arguments, 0).join(separator)
}

function gen(url) {
  return combine('/api-unsure', url)
}
