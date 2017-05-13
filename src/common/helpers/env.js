export default {
  HTTP_CONTENT_TYPE: {
    JSON: 'application/json',
    FORM: 'multipart/form-data',
  },

  HTTP_LOGIN: '/api/login',
  HTTP_GETRESTAURANTLIST: gen('restaurants'),
  HTTP_ADD_SEAT: gen('restaurants/restaurant/seats/add'),
  HTTP_UPDATE_SEAT_STATUS: gen('restaurant/seat/updatestatus'),
  HTTP_GET_SCHEDULE: gen('restaurants/restaurant/schedule'),
  HTTP_GET_TODOLIST: gen('restaurants/restaurant/todolist'),
}

export function combine(baseurl, pathname) {
  const separator = (/\/$/.test(baseurl) === false && /^\//.test(pathname) === false) ? '/' : ''
  return Array.prototype.slice.call(arguments, 0).join(separator)
}

function gen(url) {
  return combine('/api-unsure', url)
}
