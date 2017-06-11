import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import cookies from 'cookies-js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { injectIntl, FormattedMessage } from 'react-intl'

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
                this.props.history.push('/restaurant/schedule')
            } else if (userType === 2) {
                this.props.history.push('/customer/restaurants')
            }
        }
    }

    validateAccount = (rule, value, callback) => {
        if (value && value.length >= 4) {
            callback()
        } else {
            callback()
        }
    }

    validatePassword = (rule, value, callback) => {
        if (value && value.length > 4) {
            callback()
        } else {
            callback()
        }
    }

    handleSubmit = e => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                this.props.login(this.props.form.getFieldsValue())
            }
        })
    }

    handleSetLanguage = lang => {
        return e => {
            const expires = new Date(2027)

            cookies.set('lang', encodeURIComponent(lang, {
                path: '/',
                expires,
                httpOnly: false,
            }))
            location = location
        }
    }

    render() {
        const { loginStatus, form, intl } = this.props
        const { getFieldProps, getFieldError } = this.props.form

        return (
            <div className="login-container">
                <div className="login-banner">
                    <h1 className="login-h1">Sing.Fish</h1>
                </div>
                <div className="login-form">
                    <form>
                        <List>
                            <InputItem
                                {...getFieldProps('username', {
                                    rules: [
                                        { required: true, message: intl.formatMessage({ id: 'User-Login-username-errmsg' }) },
                                        { validator: this.validateAccount },
                                    ],
                                }) }
                                clear
                                autoFocus
                                maxLength={20}
                                error={!!getFieldError('username')}
                                placeholder={intl.formatMessage({ id: 'User-Login-username-placeholder' })}>
                                <FormattedMessage id="User-Login-username" />
                            </InputItem>
                            <InputItem
                                {...getFieldProps('password', {
                                    rules: [
                                        { required: true, message: intl.formatMessage({ id: 'User-Login-password-errmsg' }) },
                                        { validator: this.validatePassword },
                                    ],
                                }) }
                                clear
                                maxLength={20}
                                error={!!getFieldError('password')}
                                placeholder={intl.formatMessage({ id: 'User-Login-password-placeholder' })}
                                type="password">
                                <FormattedMessage id="User-Login-password" />
                            </InputItem>
                            <ListItem>
                                <Button
                                    type="primary"
                                    disabled={loginStatus === ActionStatus.ING}
                                    loading={loginStatus === ActionStatus.ING}
                                    onClick={this.handleSubmit}>
                                    {
                                        loginStatus === ActionStatus.ING ?
                                            <FormattedMessage id="User-Login-btnlogin-ing" /> :
                                            <FormattedMessage id="User-Login-btnlogin" />
                                    }
                                </Button>
                            </ListItem>
                        </List>
                    </form>
                </div>
                <div className="login-copyright">
                    (C)Sing.Fish
                </div>
                <div className="login-chooselan">
                    <ul className="choose-lang">
                        <li><FormattedMessage id="User-Login-chooselang" /></li>
                        <li><a href="javascript:" onClick={this.handleSetLanguage('jp')}>JP</a></li>
                        <li><a href="javascript:" onClick={this.handleSetLanguage('zh-CN')}>CN</a></li>
                        <li><a href="javascript:" onClick={this.handleSetLanguage('en-US')}>EN</a></li>
                    </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(injectIntl(Login)))
