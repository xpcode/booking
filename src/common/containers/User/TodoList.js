import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { WingBlank, Accordion } from 'antd-mobile'
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
        <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
          <Accordion.Panel header="11:30  HuangFang Chen     3">
            <List className="my-list">
              <List.Item>姓名：Cheng Zhang</List.Item>
              <List.Item>人数：2</List.Item>
              <List.Item>联系方式：+86 13800138000</List.Item>
              <List.Item>备注：</List.Item>
              <List.Item>
                <Button type="primary" onClick={this.onCancel} inline>取消席位</Button>
                <Button type="primary" onClick={this.onSubmit} inline>确认预订</Button>
              </List.Item>
              <List.Item>
                <Button type="primary" onClick={this.onCancel} inline>取消席位</Button>
              </List.Item>
            </List>
          </Accordion.Panel>
        </Accordion>
        <div>
          <Button type="primary" onClick={this.onCallback} inline>返回</Button>
        </div>
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
