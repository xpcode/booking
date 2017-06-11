import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { WingBlank, Accordion, List, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import { injectIntl, FormattedMessage } from 'react-intl'

import { getTodoList, cancelSeat, confirmOrder } from '../../../redux/modules/restaurant'
import ActionStatus from '../../../constants/ActionStatus'
import './TodoList.less'

const ListItem = List.Item

class Login extends Component {
    componentDidMount() {
        // 状态  1:待预定 2:已预定=待确认 3:已确定 4:已取消
        this.props.getTodoList(this.props.params.mealtime)
    }

    onCallback = () => {
        this.props.history.go(-1)
    }

    handleConfirmSeat = (item) => {
        return e => {
            this.props.confirmOrder(item.orderId, item.id, item.userId)
        }
    }

    handleCancelSeat = (item) => {
        return e => {
            this.props.cancelSeat(item.id)
        }
    }

    renderTodoList() {
        const { cancelSeatStatus, confirmOrderStatus } = this.props
        return this.props.todoList.map(item => {
            let title = {
                1: <FormattedMessage id="Restaurant-TodoList-unbook" />,
                2: <FormattedMessage id="Restaurant-TodoList-unconfirm" />,
                4: <FormattedMessage id="Restaurant-TodoList-cancelled" />,
            }[item.seatStatus] || item.contactname
            if (item.seatStatus == 3 && item.orderStatus != 2) {
                title = <FormattedMessage id="Restaurant-TodoList-bookfailed" />
                item.seatStatus = 4
            }
            const header = (
                <div className="span4">
                    <span className="span1">{moment(item.mealtime, 'YYYYMMDDhhmmss').format('hh:mm')}</span>
                    <span className="span2">{title}</span>
                    <span className="span3">{item.seatcount}</span>
                </div>
            )
            const pnlClass = `status-${item.seatStatus}`
            return (
                <Accordion.Panel className={pnlClass} header={header} key={item.id + '|' + item.orderId}>
                    <List className="my-list">
                        {
                            (item.seatStatus === 3 && item.orderStatus == 2) && (
                                <List.Item>
                                    <div className="content"><FormattedMessage id="Restaurant-TodoList-contactname" />：{item.contactname}</div>
                                    <div className="content"><FormattedMessage id="Restaurant-TodoList-seatcount" />：{item.seatcount}</div>
                                    <div className="content"><FormattedMessage id="Restaurant-TodoList-contactmobile" />：{item.contactmobile}</div>
                                    <div className="content"><FormattedMessage id="Restaurant-TodoList-comments" />：{item.comments}</div>
                                </List.Item>
                            )
                        }
                        {
                            item.seatStatus === 1 && (
                                <List.Item>
                                    <Button type="primary"
                                        className="btn-cancel-large"
                                        disabled={cancelSeatStatus === ActionStatus.ING}
                                        loading={cancelSeatStatus === ActionStatus.ING}
                                        onClick={this.handleCancelSeat(item)} inline>
                                        {
                                            cancelSeatStatus === ActionStatus.ING ?
                                                <FormattedMessage id="Restaurant-TodoList-cancel-ing" /> :
                                                <FormattedMessage id="Restaurant-TodoList-cancel" />
                                        }
                                    </Button>
                                </List.Item>
                            )
                        }
                        {
                            item.seatStatus === 2 && (
                                <List.Item>
                                    <Button type="primary"
                                        className="btn-cancel"
                                        disabled={cancelSeatStatus === ActionStatus.ING}
                                        loading={cancelSeatStatus === ActionStatus.ING}
                                        onClick={this.handleCancelSeat(item)} inline>
                                        {
                                            cancelSeatStatus === ActionStatus.ING ?
                                                <FormattedMessage id="Restaurant-TodoList-cancel" /> :
                                                <FormattedMessage id="Restaurant-TodoList-cancel" />
                                        }
                                    </Button>
                                    <Button type="primary"
                                        className="btn-confirm"
                                        disabled={confirmOrderStatus === ActionStatus.ING}
                                        loading={confirmOrderStatus === ActionStatus.ING}
                                        onClick={this.handleConfirmSeat(item)} inline>
                                        {
                                            confirmOrderStatus === ActionStatus.ING ?
                                                <FormattedMessage id="Restaurant-TodoList-confirm-ing" /> :
                                                <FormattedMessage id="Restaurant-TodoList-confirm" />
                                        }
                                    </Button>
                                </List.Item>
                            )
                        }
                    </List>
                </Accordion.Panel>
            )
        })
    }

    render() {
        const { getFieldProps } = this.props.form

        return (
            <WingBlank size="sm">
                <Accordion className="my-accordion" onChange={this.onChange}>
                    {this.renderTodoList()}
                </Accordion>
                <div className="btn-fixed-wrapper">
                    <Button type="primary" onClick={this.onCallback}>
                        <FormattedMessage id="Restaurant-TodoList-btncallback" />
                    </Button>
                </div>
            </WingBlank>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cancelSeatStatus: state.restaurant.get('cancelSeatStatus'),
        confirmOrderStatus: state.restaurant.get('confirmOrderStatus'),
        todoList: state.restaurant.get('todoList')
    }
}

const mapDispatchToProps = {
    getTodoList,
    cancelSeat,
    confirmOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login))
