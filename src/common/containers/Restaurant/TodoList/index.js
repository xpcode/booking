import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { WingBlank, Accordion, List, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import moment from 'moment'

import { getTodoList, updateStatus } from '../../../redux/modules/restaurant'
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
            this.props.updateStatus(item, 2)
        }
    }

    handleCancelSeat = (item) => {
        return e => {
            this.props.updateStatus(item, 3)
        }
    }

    renderTodoList() {
        return this.props.todoList.map(item => {
            const title = {
                1: '待预定',
                2: '待确认',
                3: '已确定',
                4: '已取消',
            }[item.status] || item.contactname
            const header = (
                <div className="span4">
                    <span className="span1">{moment(item.mealtime, 'YYYYMMDDhhmmss').format('hh:mm')}</span>
                    <span className="span2">{title}</span>
                    <span className="span3">{item.seatcount}</span>
                </div>
            )
            return (
                <Accordion.Panel header={header} key={item.orderId}>
                    <List className="my-list">
                        {
                            (item.status === 3) && (
                                <div>
                                    <List.Item>姓名：{item.contactname}</List.Item>
                                    <List.Item>人数：{item.seatcount}</List.Item>
                                    <List.Item>联系方式：{item.contactmobile}</List.Item>
                                    <List.Item>备注：{item.comments}</List.Item>
                                </div>
                            )
                        }
                        {
                            item.status === 1 && (
                                <List.Item>
                                    <Button type="primary" onClick={this.handleCancelSeat(item)} inline>取消席位</Button>
                                </List.Item>
                            )
                        }
                        {
                            item.status === 2 && (
                                <List.Item>
                                    <Button type="primary" onClick={this.handleCancelSeat(item)} inline>取消席位</Button>
                                    <Button type="primary" onClick={this.handleConfirmSeat(item)} inline>确认预订</Button>
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
                <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
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
    updateStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login))
