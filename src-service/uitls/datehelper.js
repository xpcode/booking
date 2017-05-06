import moment from 'moment'

export const timeToNumber = (time) => {
  if (!time instanceof Date)
    return 0

  const str = [
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  ].join('')

  return Number(str)
}
