import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Flex, WhiteSpace, List, InputItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'

const ListItem = List.Item
const FlexItem = Flex.Item

class Login extends Component {
  constructor(props) {
    super(props)
  }

  validateAccount = (rule, value, callback) => {
    if (value && value.length > 4) {
      callback();
    } else {
      callback(new Error('帐号至少4个字符'));
    }
  }

  render() {
    const { getFieldProps } = this.props.form

    return (
      <WingBlank size="sm">
        <Flex direction="column">
          <FlexItem flex={5}>
            Sing.Fish
        </FlexItem>
          <FlexItem>
            <List renderHeader={() => '自定义获取光标'}>
              <ListItem>
                <InputItem
                  {...getFieldProps('account', {
                    rules: [
                      { required: true, message: '请输入帐号' },
                      { validator: this.validateAccount },
                    ],
                  }) }
                  placeholder="请输入账号"
                  clear
                  maxLength={16}
                  autoFocus
                >账号</InputItem>
              </ListItem>
              <ListItem>
                <InputItem
                  {...getFieldProps('password') }
                  type="password"
                  placeholder="请输入密码"
                  clear
                  maxLength={16}
                >密码</InputItem>
              </ListItem>
              <ListItem>
                <Button type="primary" onClick={this.onSubmit} inline>提交验证</Button>
              </ListItem>
            </List>
          </FlexItem>
          <FlexItem>
            (C)Sing.Fish
        </FlexItem>
          <FlexItem>
            Choose Language
        </FlexItem>
        </Flex >
      </WingBlank>
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
