import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button } from 'antd-mobile'
import moment from 'moment'

import { getFreeSeats } from '../../../redux/modules/customer'
import { Calendar } from '../../../components'
import ActionStatus from '../../../constants/ActionStatus'

const ListItem = List.Item

class RestaurantList extends Component {
  constructor(props) {
    super(props)

    const { restaurantId } = props.params
    const currentDate = moment()

    this.state = {
      restaurantId,
      initDate0: currentDate,
      initDate1: moment().set('month', currentDate.month() + 1),
      initDate2: moment().set('month', currentDate.month() + 2)
    }
  }

  componentDidMount() {
    this.props.getFreeSeats(this.state.restaurantId)
  }

  handleClickDate = (date) => {
    const restaurantId = this.state.restaurantId
    this.props.history.push(`/customer/restaurants/${restaurantId}/order`)
  }

  render() {
    const { freeSeats } = this.props
    const { initDate0, initDate1, initDate2 } = this.state

    return (
      <div className="restaurantlist">
        <div className="calendars">
          <div className="calendar-wrapper">
            <h2>{initDate0.year()}年{initDate0.month() + 1}月 本月</h2>
            <Calendar date={initDate0} dataSource={freeSeats} onClickDay={this.handleClickDate} />
          </div>
          <div className="calendar-wrapper">
            <h2>{initDate0.year()}年{initDate1.month() + 1}月</h2>
            <Calendar date={initDate1} dataSource={freeSeats} onClickDay={this.handleClickDate} />
          </div>
          <div className="calendar-wrapper">
            <h2>{initDate0.year()}年{initDate2.month() + 1}月</h2>
            <Calendar date={initDate2} dataSource={freeSeats} onClickDay={this.handleClickDate} />
          </div>
        </div>
        <div className="btn-fixed-wrapper">
          <Button type="primary" onClick={this.handleAddSeat}>+ 添加席位</Button>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    freeSeats: state.restaurant.get('freeSeats')
  }
}

const mapDispatchToProps = {
  getFreeSeats
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList)
