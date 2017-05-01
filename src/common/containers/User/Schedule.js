import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Flex, WhiteSpace, List, InputItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'

import { Calendar } from '../../components'

const ListItem = List.Item
const FlexItem = Flex.Item

class Login extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { getFieldProps } = this.props.form

    return (
      <Flex direction="column">
        <FlexItem flex={5}>
          <Calendar
            date={this.state.date}
            onPickDate={(date) => console.log(date)}
          />
        </FlexItem>
        <FlexItem>
          <Calendar
            date={this.state.date}
            onPickDate={(date) => console.log(date)}
          />
        </FlexItem>
        <FlexItem>
          <Calendar
            date={this.state.date}
            onPickDate={(date) => console.log(date)}
          />
        </FlexItem>
      </Flex >
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login))
