// import 'es6-promise'
// import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
// https://github.com/yahoo/react-intl#example
// https://github.com/ant-design/intl-example/blob/master/docs/understanding-antd-i18n.md
// http://www.cnblogs.com/qiaojie/p/6411199.html
import { match } from 'react-router'
import { IntlProvider, addLocaleData } from 'react-intl'
import { LocaleProvider } from 'antd'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import ja from 'react-intl/locale-data/ja'

import { ACTION_INIT } from '../common/redux/modules/user'
import Isomorph from '../common/helpers/Isomorph'
import routes from '../common/redux/routes'
import messages, { locale } from '../locales'
import './style.less'

addLocaleData([...en, ...zh, ...ja])

const finalState = {}
const {
  routing,
    ...reducers
} = window.__INITIAL_STATE__ || {}

if (reducers) {
    for (let p in reducers) {
        let reducer = reducers[p]
        finalState[p] = Immutable.fromJS(reducer)
    }
}

const rootElement = document.getElementById('container')
const { pathname, search, hash } = window.location
const location = `${pathname}${search}${hash}`

const store = Isomorph.createStore(finalState)
const history = Isomorph.createHistory(store, pathname)

store.dispatch({ type: ACTION_INIT })

match({ routes, location }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
        (
            <LocaleProvider locale={locale}>
                <IntlProvider locale={locale} messages={messages}>
                    <Isomorph store={store} history={history} />
                </IntlProvider>
            </LocaleProvider>
        ),
        rootElement
    )
})

if (module.hot) {
    module.hot.accept()
}
