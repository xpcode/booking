import BrowserLocale from 'browser-locale'
import cookies from 'cookies-js'

import zh_CN from './zh-CN'
import en_US from './en-US'
import ja from './ja'

const messageObj = {
    'zh-CN': zh_CN,
    'en-US': en_US,
    'en': en_US,
    'ja': ja,
}

export const locale = cookies.get('lang') || BrowserLocale()

console.debug(locale)

export default messageObj[locale] || zh_CN
