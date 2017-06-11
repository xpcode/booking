import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Accordion, List, InputItem, Button } from 'antd-mobile'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'

import { getMyOrderList } from '../../../redux/modules/customer'
import ActionStatus from '../../../constants/ActionStatus'
import './MyOrder.less'

const ListItem = List.Item

class MyOrderList extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getMyOrderList()
    }

    renderMyOrderList() {
        // 状态  1:待确认 2:已确认 3:席位已取消 4:预定失败
        // 状态  1:待预定 2:已预定待确认; 3:已确定 4:已取消 s
        return this.props.myorders.map(item => {
            const title = {
                1: <FormattedMessage id="Customer-MyOrders-unconfirm" />,
                2: <FormattedMessage id="Customer-MyOrders-confirmed" />,
                4: <FormattedMessage id="Customer-MyOrders-cancelled" />,
            }[item.status] || item.contactname
            const header = (
                <div className="span4">
                    <span className="span1">{moment(item.mealtime, 'YYYYMMDDhhmmss').format('hh:mm')}</span>
                    <span className="span3">{title}</span>
                    <span className="span2">{item.restaurantName}</span>
                </div>
            )
            const pnlClass = `orderstatus-${item.status}`
            return (
                <Accordion.Panel className={pnlClass} header={header} key={String(item.id)}>
                    <List className="my-list">
                        <List.Item>
                            <div className="content"><FormattedMessage id="Customer-MyOrders-contactname" />：{item.contactname}</div>
                            <div className="content"><FormattedMessage id="Customer-MyOrders-seatcount" />：{item.seatcount}</div>
                            <div className="content"><FormattedMessage id="Customer-MyOrders-contactmobile" />：{item.contactmobile}</div>
                            <div className="content"><FormattedMessage id="Customer-MyOrders-comments" />：{item.comments}</div>
                        </List.Item>
                    </List>
                </Accordion.Panel>
            )
        })
    }

    handleCallback() {
        this.props.history.push('/customer/restaurants')
    }


    render() {
        const activeKey = this.props.myorders.map(item => String(item.id))
        return (
            <div className="myorders">
                <Accordion activeKey={activeKey} className="my-accordion" onChange={this.onChange}>
                    {this.renderMyOrderList()}
                </Accordion>
                <div className="btn-fixed-wrapper">
                    <Button type="primary" onClick={this.handleCallback.bind(this)}>
                        <FormattedMessage id="Customer-MyOrders-btncallback" />
                    </Button>
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
