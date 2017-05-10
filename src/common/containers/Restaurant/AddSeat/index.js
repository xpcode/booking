import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Flex, WhiteSpace, WingBlank, List, InputItem, Button, TextareaItem } from 'antd-mobile'
import { createForm } from 'rc-form'

const ListItem = List.Item
const FlexItem = Flex.Item

class AddSeat extends Component {
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
            <List renderHeader={() => '新增开放席位'}>
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

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(AddSeat))
