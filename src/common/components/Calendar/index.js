import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { range, takeWhile, last } from 'lodash'

import './Calendar.less'

export default class Calendar extends Component {

  static propTypes = {
    date: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    onClickDay: PropTypes.func
  }

  static defaultProps = {
    onClickDay: function () { },
    dataSource: {}
  }

  createDateObjects(date) {
    const max = date.daysInMonth() + 1

    return this.createStartWeekOffset(date.clone())
      .concat(range(1, max).map(index => {
        return moment([date.year(), date.month(), index])
      }))
    // .concat(this.createEndWeekOffset(date))
  }

  createStartWeekOffset(date) {
    const prevMonth = date.clone().set('month', date.month() - 1)
    const currentMonth = date.clone().set('date', 1)

    const len = (currentMonth.day() || 7) - 1
    const max = prevMonth.daysInMonth() + 1

    return range(max - len, max).map(index => {
      return moment([prevMonth.year(), prevMonth.month(), index])
    })
  }

  createEndWeekOffset(date) {
    const len = date.day()
    const prevMonthDay = date.set('month', date.month() + 1)

    return range(1, len).map(index => moment([date.year(), date.month(), index]))
  }

  handleClickCell(date) {
    return e => this.props.onClickDay(date)
  }

  renderGridCell(date) {
    const dataSource = this.props.dataSource
    const key = date.format('YYYYMMDD')

    return (
      <div key={date.format('x')} className={`calendar-grid-item ${dataSource[key]}`} onClick={this.handleClickCell(date)}>
        {date.date()}
      </div>
    )
  }

  render() {
    // SELECT
    // o.contactinfo, o.contactmobile, o.contactname, o.status,
    // s.mealtime, s.seatcount, s.comments

    // FROM order o INNER JOIN seat s ON o.seatId=s.id
    const { date } = this.props

    return (
      <div className='calendar'>
        <div className='calendar-grid'>
          <div className="calendar-grid-item">一</div>
          <div className="calendar-grid-item">二</div>
          <div className="calendar-grid-item">三</div>
          <div className="calendar-grid-item">四</div>
          <div className="calendar-grid-item">五</div>
          <div className="calendar-grid-item">六</div>
          <div className="calendar-grid-item">日</div>
          {this.createDateObjects(date).map(item => this.renderGridCell(item))}
        </div>
      </div>
    )
  }
}
