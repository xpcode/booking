import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import './Master.less'

class MasterAdaptor extends Component {
  render() {
    const { children } = this.props
    const userType = this.props.user.get('type')

    if (userType === 1) {
      return this.renderRestaurantMaster()
    }

    return (
      <div>
        {children}
      </div>
    )
  }

  renderRestaurantMaster() {
    return (
      <div className="master-warpper">
        <div className="header">
          <h1>KKK</h1>
          <a href="/logout">登出</a>
        </div>
        {this.props.children}
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.get('user'),
  }
}

export default connect(mapStateToProps)(MasterAdaptor)

