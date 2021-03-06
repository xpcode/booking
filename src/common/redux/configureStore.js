import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import Immutable from 'immutable'

import rootReducer from './reducers'

export default function configureStore(initialState) {
  const middlewares = [thunk]

  if (process.env.__CLIENT__ === true) {
    const stateTransformer = states => {
      let finalStates = {}
      for (let key in states) {
        if (!states.hasOwnProperty(key))
          continue

        const state = states[key]

        if (Immutable.Iterable.prototype.isPrototypeOf(state) && Object.prototype.toString.call(state.toObject) === '[object Function]') {
          finalStates[key] = state.toObject()
        } else if (Object.prototype.toString.call(state) === '[object Object]') {
          finalStates[key] = key === 'routing' ? states : stateTransformer(state)
        }
      }
      return finalStates
    }
    const args = {
      stateTransformer,
      collapsed: true,
      colors: {
        title: () => `red`,
        prevState: () => `blue`,
        action: () => `orange`,
        nextState: () => `green`,
        error: () => `#F20404`,
      },
    }

    middlewares.push(createLogger(args))
  }

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares),
    (
      process.env.__CLIENT__ === true && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  ))

  return store
}
