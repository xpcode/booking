import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Accordion, List, InputItem, Button } from 'antd-mobile'
import moment from 'moment'

import { getMyOrderList } from '../../../redux/modules/customer'
import ActionStatus from '../../../constants/ActionStatus'

const ListItem = List.Item

class MyOrderList extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getMyOrderList()
  }

  renderMyOrderList() {
    // 状态  1:待确认 2:已确认 3:席位已取消
    return this.props.myorders.map(item => {
      const title = {
        1: '待确认',
        2: '已确认',
        4: '席位已取消',
      }[item.status] || item.contactname
      const header = (
        <div className="span4">
          <span className="span1">{moment(item.mealtime, 'YYYYMMDDhhmmss').format('hh:mm')}</span>
          <span className="span3">{title}</span>
          <span className="span2">{item.restaurantName}</span>
        </div>
      )
      return (
        <Accordion.Panel header={header} key={item.id}>
          <List className="my-list">
            <div>
              <List.Item>姓名：{item.contactname}</List.Item>
              <List.Item>人数：{item.seatcount}</List.Item>
              <List.Item>联系方式：{item.contactmobile}</List.Item>
              <List.Item>备注：{item.comments}</List.Item>
            </div>
          </List>
        </Accordion.Panel>
      )
    })
  }

  render() {
    return (
      <div>
        <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
          {this.renderMyOrderList()}
        </Accordion>
        <div className="btn-fixed-wrapper">
          <Button type="primary" onClick={this.onCallback}>返回</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    myorders: state.customer.get('myorders')
  }
}

const mapDispatchToProps = {
  getMyOrderList
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrderList)
