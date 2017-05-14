import React, { Component, PropTypes } from 'react'
import { range, takeWhile, last } from 'lodash'
import moment from 'moment'

import './Calendar.less'

export default class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prefix: Date.now()
    }
  }

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

    const startFill = this.createStartWeekOffset(date.clone())
      .map(item => this.renderGridCell(item, 1, true))

    const currentMonth = range(1, max)
      .map(index => {
        return moment([date.year(), date.month(), index])
      })
      .map(item => this.renderGridCell(item, 2))

    const endFill = this.createEndWeekOffset(date.year(), date.month(), startFill.length + currentMonth.length)
      .map(item => this.renderGridCell(item, 3, true))

    return startFill
      .concat(currentMonth)
      .concat(endFill)
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

  createEndWeekOffset(year, month, len) {
    return range(1, 8 - len % 7).map(index => {
      return moment([year, month, index])
    })
  }

  handleClickCell(date) {
    return e => this.props.onClickDay(date)
  }

  renderGridCell(date, num, isFill = false) {
    const dataSource = this.props.dataSource
    const key = date.format('YYYYMMDD')
    const gray = isFill ? 'gray' : ''
    const color = dataSource[key] || ''

    return (
      <div key={this.state.prefix + num + key} className={`calendar-grid-item ${color} ${gray}`} onClick={this.handleClickCell(date)}>
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
          <div className="calendar-header-item">一</div>
          <div className="calendar-header-item">二</div>
          <div className="calendar-header-item">三</div>
          <div className="calendar-header-item">四</div>
          <div className="calendar-header-item">五</div>
          <div className="calendar-header-item">六</div>
          <div className="calendar-header-item">日</div>
          {this.createDateObjects(date)}
        </div>
      </div>
    )
  }
}
