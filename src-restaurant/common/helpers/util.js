/**
 * 将fetch函数的response转化为json格式
 */
export const toJSON = response => {
  if (response.status !== 200) {
    const code = process.env.__CLIENT__ === true ? response.status : 500
    return {
      code,
      message: response.text()
    }
  }

  let json = null
  try {
    json = response.json()
  } catch (e) {
    json = {
      code: 500,
      message: `接口返回格式不是application/json格式`
    }
    if (process.env.__CLIENT__ !== true) {
      // TODO: 此处应有日志
    }
  }

  return json
}

/**
 * 处理fetch接口后的业务状态码，如登陆失效
 */
export const auth = json => {
  if (json.code === 401) {
    location.href = '/logout'
  }
  return json
}

/**
 * 提供fetch函数的第二个参数
 */
export const genFetchOptions = (method, headers, paramsObj) => {
  let _headers = headers, _paramsObj = paramsObj

  if (paramsObj === undefined) {
    _paramsObj = headers
    _headers = {
      'content-type': 'application/json'
    }
  }
  return {
    method,
    headers: _headers,
    body: JSON.stringify(_paramsObj),
    credentials: 'include',
  }
}

/**
 * 提供fetch函数的异常捕捉参数
 */
export const catchException = error => {
  return {
    code: 500,
    message: error.toString()
  }
}

/**
 * 生成一个redux可用的action对象
 */
export const genAction = (type, payload) => {
  return {
    type,
    payload
  }
}

/**
 * 一个空函数
 */
export const doNothing = () => { }
