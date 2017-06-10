import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { WingBlank, Accordion, List, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import moment from 'moment'

import { getTodoList, cancelSeat, confirmOrder } from '../../../redux/modules/restaurant'
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
            this.props.confirmOrder(item.orderId, item.id)
        }
    }

    handleCancelSeat = (item) => {
        return e => {
            this.props.cancelSeat(item.id)
        }
    }

    renderTodoList() {
        return this.props.todoList.map(item => {
            let title = {
                1: '待预定',
                2: '待确认',
                4: '已取消',
            }[item.seatStatus] || item.contactname
            if (item.seatStatus == 3 && item.orderStatus != 2) {
                title = '预订失败'
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
                                    <div className="content">姓名：{item.contactname}</div>
                                    <div className="content">人数：{item.seatcount}</div>
                                    <div className="content">联系方式：{item.contactmobile}</div>
                                    <div className="content">备注：{item.comments}</div>
                                </List.Item>
                            )
                        }
                        {
                            item.seatStatus === 1 && (
                                <List.Item>
                                    <Button type="primary" className="btn-cancel-large" onClick={this.handleCancelSeat(item)} inline>取消席位</Button>
                                </List.Item>
                            )
                        }
                        {
                            item.seatStatus === 2 && (
                                <List.Item>
                                    <Button type="primary" className="btn-cancel" onClick={this.handleCancelSeat(item)} inline>取消席位</Button>
                                    <Button type="primary" className="btn-confirm" onClick={this.handleConfirmSeat(item)} inline>确认预订</Button>
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
                    <Button type="primary" onClick={this.onCallback}>返回</Button>
                </div>
            </WingBlank>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        todoList: state.restaurant.get('todoList')
    }
}

const mapDispatchToProps = {
    getTodoList,
    cancelSeat,
    confirmOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login))
