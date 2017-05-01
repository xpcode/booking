import React, { PropTypes, Component } from 'react'

class MasterPage extends Component {
  render() {
    const { children } = this.props

    return (
      <div>
        {children}
      </div>
    )
  }
}

export default MasterPage
