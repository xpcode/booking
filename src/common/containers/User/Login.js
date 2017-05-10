import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import BrowserLocale from 'browser-locale'

import { login } from '../../redux/modules/user'
import ActionStatus from '../../constants/ActionStatus'
import './Login.less'

const ListItem = List.Item

class Login extends Component {
  constructor(props) {
    super(props)

    const userType = props.user.get('type')
    if (userType) {
      if (userType === 1) {
        location.href = '/restaurant/schedule'
      } else if (userType === 2) {
        location.href = '/customer/restaurants'
      }
    }
  }

  validateAccount = (rule, value, callback) => {
    if (value && value.length >= 4) {
      callback()
    } else {
      callback(new Error('帐号至少4个字符'))
    }
  }

  validatePassword = (rule, value, callback) => {
    if (value && value.length > 4) {
      callback()
    } else {
      callback(new Error('密码至少6个字符'))
    }
  }

  handleSubmit = e => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        this.props.login(this.props.form.getFieldsValue())
      }
    })
  }

  render() {
    const { loginStatus, form } = this.props
    const { getFieldProps, getFieldError } = this.props.form

    return (
      <div className="login-container">
        <div className="login-banner">
          <h1 className="login-h1">Sing.Fish</h1>
        </div>
        <div className="login-form">
          <form>
            <List renderFooter={() => getFieldError('username') && getFieldError('username').join(',')}>
              <InputItem
                {...getFieldProps('username', {
                  rules: [
                    { required: true, message: '请输入帐号' },
                    { validator: this.validateAccount },
                  ],
                }) }
                clear
                autoFocus
                defaultValue="earl"
                error={!!getFieldError('username')}
                onErrorClick={() => {
                  alert(getFieldError('username').join('、'))
                }}
                placeholder="请输入账号">
                帐号
              </InputItem>
              <InputItem
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入帐号' },
                    { validator: this.validatePassword },
                  ],
                }) }
                clear
                defaultValue="666666"
                error={!!getFieldError('password')}
                onErrorClick={() => {
                  alert(getFieldError('password').join('、'))
                }}
                placeholder="请输入密码"
                type="password">
                密码
              </InputItem>
              <ListItem>
                <Button
                  type="primary"
                  disabled={loginStatus === ActionStatus.ING}
                  loading={loginStatus === ActionStatus.ING}
                  onClick={this.handleSubmit}>登录</Button>
              </ListItem>
            </List>
          </form>
        </div>
        <div className="login-copyright">
          (C)Sing.Fish
          </div>
        <div className="login-chooselan">
          Choose Language
          </div>
      </div >
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loginStatus: state.user.get('loginStatus'),
    user: state.user.get('user'),
  }
}

const mapDispatchToProps = {
  login
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login))
