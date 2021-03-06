import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button } from 'antd-mobile'
import { injectIntl, FormattedMessage } from 'react-intl'
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
        const qs = location.search.split('n=')
        const restaurantName = qs.length < 2 ? '..' : decodeURIComponent(qs[1])

        this.state = {
            restaurantId,
            restaurantName,
            initDate0: currentDate,
            initDate1: moment().set('month', currentDate.month() + 1),
            initDate2: moment().set('month', currentDate.month() + 2)
        }
    }

    componentDidMount() {
        this.props.getFreeSeats(this.state.restaurantId)
    }

    handleClickDate = (date) => {
        const { freeSeats } = this.props
        const restaurantId = this.state.restaurantId
        const mealtime = date.format('YYYYMMDD')

        if (freeSeats[mealtime]) {
            this.props.history.push(`/customer/restaurants/${restaurantId}/${mealtime}`)
        }
    }

    handleCallback() {
        this.props.history.push('/customer/restaurants')
    }

    render() {
        const { freeSeats } = this.props
        const { initDate0, initDate1, initDate2, restaurantName } = this.state

        return (
            <div className="restaurantlist">
                <h2>{restaurantName}</h2>
                <div className="calendars">
                    <div className="calendar-wrapper">
                        <h2>{initDate0.year()}.{initDate0.month() + 1} <FormattedMessage id="Customer-FreeSeats-currentmonth" /></h2>
                        <Calendar date={initDate0} dataSource={freeSeats} onClickDay={this.handleClickDate} />
                    </div>
                    <div className="calendar-wrapper">
                        <h2>{initDate0.year()}.{initDate1.month() + 1}</h2>
                        <Calendar date={initDate1} dataSource={freeSeats} onClickDay={this.handleClickDate} />
                    </div>
                    <div className="calendar-wrapper">
                        <h2>{initDate0.year()}.{initDate2.month() + 1}</h2>
                        <Calendar date={initDate2} dataSource={freeSeats} onClickDay={this.handleClickDate} />
                    </div>
                </div>
                <div className="btn-fixed-wrapper">
                    <Button type="primary" onClick={this.handleCallback.bind(this)}>
                        <FormattedMessage id="Customer-FreeSeats-btncallback" />
                    </Button>
                </div>
            </div >
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        freeSeats: state.customer.get('freeSeats')
    }
}

const mapDispatchToProps = {
    getFreeSeats
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList)
