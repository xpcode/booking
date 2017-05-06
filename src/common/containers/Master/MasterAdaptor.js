import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

class MasterAdaptor extends Component {
  render() {
    const { children } = this.props
    const userType = this.props.user.get('type')

    return (
      <div>
        {children}
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

