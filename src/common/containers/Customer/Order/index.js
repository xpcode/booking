import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button, TextareaItem } from 'antd-mobile'
import { createForm } from 'rc-form'

const ListItem = List.Item

class Order extends Component {
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
      <div>
        <div>
          Sing.Fish
        </div>
        <div>
          <List renderHeader={() => '数寄屋桥次郎'}>
            <ListItem>
              <InputItem
                {...getFieldProps('date', {
                  rules: [
                    { required: true, message: '请选择日期' },
                    { validator: this.validateDate },
                  ],
                }) }
                placeholder="请选择日期"
                clear
                maxLength={11}
                autoFocus
              >日期</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('time') }
                placeholder="请选择时间"
                clear
                maxLength={5}
              >时间</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('count') }
                placeholder="请填写人数"
                clear
                maxLength={5}
              >人数</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('count') }
                placeholder="请填写姓名"
                clear
                maxLength={5}
              >姓名</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('count') }
                placeholder="请填写联系方式"
                clear
                maxLength={5}
              >联系方式</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('count') }
                placeholder="请填写信用卡号"
                clear
                maxLength={5}
              >信用卡号</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('count') }
                placeholder="请填写信用卡有效期（MM/YY)"
                clear
                maxLength={5}
              >有效期（MM/YY)</InputItem>
            </ListItem>
            <ListItem>
              <InputItem
                {...getFieldProps('count') }
                placeholder="请填写信用卡安全码"
                clear
                maxLength={5}
              >安全码</InputItem>
            </ListItem>
            <ListItem>
              <TextareaItem
                {...getFieldProps('note3') }
                placeholder="请填写备注"
                title="备注"
                autoHeight
                labelNumber={5}
              />
            </ListItem>
            <ListItem>
              <Button onClick={this.onCancel} inline>取消</Button>
              <Button type="primary" onClick={this.onSubmit} inline>开放席位</Button>
            </ListItem>
          </List>
        </div>
        <div>
          (C)Sing.Fish
        </div>
        <div>
          Choose Language
        </div>
      </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Order))
