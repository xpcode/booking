import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button, TextareaItem, DatePicker, Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import moment from 'moment'

import { getTimeList, addOrder } from '../../../redux/modules/customer'

const ListItem = List.Item

class Order extends Component {
  constructor(props) {
    super(props)

    const { restaurantId, mealtime } = props.params

    this.state = {
      restaurantId,
      mealtime,
      seatId: 0
    }
  }

  componentDidMount() {
    const { restaurantId, mealtime } = this.state
    this.props.getTimeList(restaurantId, mealtime)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.timeList !== this.props.timeList) {
      const timeList = nextProps.timeList.toJS()
      if (timeList.length > 0) {
        this.setState({
          seatId: timeList[0].value
        })
      }
    }
  }

  onSubmit = () => {
    const { params, form, addOrder, history } = this.props
    const { restaurantId, mealtime, seatId } = this.state

    form.validateFields({ force: true }, (error) => {
      if (!error && seatId) {
        addOrder({
          seatId,
          restaurantId,
          mealtime,
          ...form.getFieldsValue()
        })
      }
    })
  }

  onPickerChange = (val) => {
    this.setState({
      seatId: val[0]
    })
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    const { restaurantId, mealtime, seatId } = this.state
    const initDate = !!mealtime ? moment(mealtime, 'YYYYMMDD') : null
    const timeList = this.props.timeList.toJS()

    return (
      <div>
        <div>
          Sing.Fish
        </div>
        <div>
          <List renderHeader={() => '数寄屋桥次郎'}>
            <DatePicker
              {...getFieldProps('date', {
                initialValue: initDate,
              }) }
              onErrorClick={() => {
                alert(getFieldError('date').join('、'))
              }}
              title="选择日期"
              mode="date"
              disabled={!!initDate}
              format={val => val.format('YYYY-MM-DD')}
            >
              <ListItem>日期</ListItem>
            </DatePicker>
            <Picker
              {...getFieldProps('time', {
                initialValue: [seatId],
                rules: [
                  { required: true, message: '请选择时间' }
                ],
              }) }
              value={[seatId]}
              data={timeList}
              onChange={this.onPickerChange}
            >
              <ListItem arrow="horizontal">时间</ListItem>
            </Picker>
            <InputItem
              {...getFieldProps('count', {
                rules: [
                  { required: true, message: '请填写人数' },
                  { validator: this.validateCount },
                ],
              }) }
              placeholder="请填写人数"
              type="number"
              clear
              maxLength={3}
            >
              <ListItem>人数</ListItem>
            </InputItem>
            <InputItem
              {...getFieldProps('contactname', {
                rules: [
                  { required: true, message: '请填写姓名' },
                ],
              }) }
              placeholder="请填写姓名"
              clear
              maxLength={20}
            >
              <ListItem>姓名</ListItem>
            </InputItem>
            <InputItem
              {...getFieldProps('contactmobile', {
                rules: [
                  { required: true, message: '请填写联系方式' },
                ],
              }) }
              placeholder="请填写联系方式"
              mode="mobile"
              clear
            >
              <ListItem>联系方式</ListItem>
            </InputItem>
            <InputItem
              {...getFieldProps('cardNO', {
                rules: [
                  { required: true, message: '请填写信用卡号' },
                ],
              }) }
              placeholder="请填写信用卡号"
              clear
              mode="number"
              maxLength={32}
            >
              <ListItem>信用卡号</ListItem>
            </InputItem>
            <InputItem
              {...getFieldProps('cardExpires', {
                rules: [
                  { required: true, message: '请填写信用卡有效期' },
                ],
              }) }
              placeholder="请填写信用卡有效期（MM/YY)"
              clear
              maxLength={32}
            >
              <ListItem>有效期（MM/YY)</ListItem>
            </InputItem>
            <InputItem
              {...getFieldProps('cardCode', {
                rules: [
                  { required: true, message: '请填写信用卡安全码' },
                ],
              }) }
              placeholder="请填写信用卡安全码"
              clear
              maxLength={32}
            >
              <ListItem>安全码</ListItem>
            </InputItem>
            <ListItem>
              <Button onClick={this.onCancel} inline>取消</Button>
              <Button type="primary" onClick={this.onSubmit} inline>预定</Button>
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
    timeList: state.customer.get('timeList')
  }
}

const mapDispatchToProps = {
  getTimeList,
  addOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Order))
