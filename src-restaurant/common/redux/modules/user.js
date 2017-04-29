import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import Cookies from 'cookies-js'

const $$initialState = Immutable.fromJS({
})


export default ($$state = $$initialState, action) => {
  switch (action.type) {
    default:
      return $$state
  }
}
