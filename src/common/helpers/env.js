export default {
  HTTP_CONTENT_TYPE: {
    JSON: 'application/json',
    FORM: 'multipart/form-data',
  },

  HTTP_LOGIN: '/api/login',
  HTTP_GETRESTAURANTLIST: gen('restaurants'),
}

export function combine(baseurl, pathname) {
  const separator = (/\/$/.test(baseurl) === false && /^\//.test(pathname) === false) ? '/' : ''
  return Array.prototype.slice.call(arguments, 0).join(separator)
}

function gen(url) {
  return combine('/api-unsure', url)
}
