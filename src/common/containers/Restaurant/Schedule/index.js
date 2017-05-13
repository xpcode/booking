import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Flex, WhiteSpace, List, InputItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import moment from 'moment'

import { getSchedule } from '../../../redux/modules/restaurant'
import { Calendar } from '../../../components'
import './Schedule.less'

const ListItem = List.Item
const FlexItem = Flex.Item

class Schedule extends Component {
  constructor(props) {
    super(props)

    const currentDate = moment()

    this.state = {
      initDate0: currentDate,
      initDate1: moment().set('month', currentDate.month() + 1),
      initDate2: moment().set('month', currentDate.month() + 2)
    }
  }

  componentDidMount() {
    this.props.getSchedule()
  }

  handleClickDate = (date) => {
    const mealtime = date.format('YYYYMMDD')
    if (this.props.schedule[mealtime]) {
      this.props.history.push(`/restaurant/schedule/${mealtime}`)
    } else {
      this.props.history.push(`/restaurant/seats/add/${mealtime}`)
    }
  }

  handleAddSeat = () => {
    this.props.history.push(`/restaurant/seats/add`)
  }

  render() {
    const { schedule } = this.props
    const { getFieldProps } = this.props.form
    const { initDate0, initDate1, initDate2 } = this.state

    return (
      <div>
        <div className="calendars">
          <div className="calendar-wrapper">
            <h2>{initDate0.year()}年{initDate0.month() + 1}月 本月</h2>
            <Calendar date={initDate0} dataSource={schedule} onClickDay={this.handleClickDate} />
          </div>
          <div className="calendar-wrapper">
            <h2>{initDate0.year()}年{initDate1.month() + 1}月</h2>
            <Calendar date={initDate1} dataSource={schedule} onClickDay={this.handleClickDate} />
          </div>
          <div className="calendar-wrapper">
            <h2>{initDate0.year()}年{initDate2.month() + 1}月</h2>
            <Calendar date={initDate2} dataSource={schedule} onClickDay={this.handleClickDate} />
          </div>
        </div>
        <div className="btn-fixed-wrapper">
          <Button type="primary" onClick={this.handleAddSeat}>+ 添加席位</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schedule: state.restaurant.get('schedule')
  }
}

const mapDispatchToProps = {
  getSchedule
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Schedule))
