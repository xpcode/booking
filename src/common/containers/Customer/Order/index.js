import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button, TextareaItem, DatePicker, Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'

import { getTimeList, addOrder } from '../../../redux/modules/customer'
import ActionStatus from '../../../constants/ActionStatus'
import './Order.less'

const ListItem = List.Item

class Order extends Component {
    constructor(props) {
        super(props)

        const { restaurantId, mealtime } = props.params

        this.state = {
            restaurantId,
            mealtime,
            seatId: 0,
            seatcount: null,
            restaurantName: '..'
        }
    }

    componentDidMount() {
        const { restaurantId, mealtime } = this.state
        this.props.getTimeList(restaurantId, mealtime)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.timeList !== this.props.timeList) {
            const timeList = nextProps.timeList.toJS()
            if (timeList.length > 0) {
                this.setState({
                    seatId: timeList[0].value,
                    seatcount: timeList[0].seatcount,
                    restaurantName: timeList[0].restaurantName
                })
            }
        }
    }

    onSubmit = (e) => {
        const { params, form, addOrder, userId } = this.props
        const { restaurantId, mealtime, seatId } = this.state

        form.validateFields({ force: true }, (error) => {
            if (!error && seatId) {
                addOrder({
                    seatId,
                    userId,
                    restaurantId,
                    mealtime,
                    ...form.getFieldsValue()
                })
            }
        })
    }

    onCancel = () => {
        window.history.go(-1)
    }

    onPickerChange = (val) => {
        const timeList = this.props.timeList.toJS()
        let seatcount = this.state.seatcount
        timeList.forEach(item => {
            if (val[0] == item.value) {
                seatcount = item.seatcount
            }
        })
        this.setState({
            seatcount,
            seatId: val[0],
        })
    }

    render() {
        const { addOrderStatus } = this.props
        const { getFieldProps, getFieldError } = this.props.form
        const { restaurantId, mealtime, seatId, seatcount, restaurantName } = this.state
        const initDate = !!mealtime ? moment(mealtime, 'YYYYMMDD') : null
        const timeList = this.props.timeList.toJS()

        return (
            <div className="addorder">
                <List renderHeader={() => restaurantName}>
                    <DatePicker
                        {...getFieldProps('date', {
                            initialValue: initDate,
                        }) }
                        onErrorClick={() => {
                            alert(getFieldError('date').join('、'))
                        }}
                        mode="date"
                        disabled={!!initDate}
                        format={val => val.format('YYYY-MM-DD')}
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-date" />
                        </ListItem>
                    </DatePicker>
                    <Picker
                        {...getFieldProps('time', {
                            initialValue: [seatId],
                            rules: [
                                { required: true, message: '请选择时间' }
                            ],
                        }) }
                        value={[seatId]}
                        data={timeList}
                        onChange={this.onPickerChange}
                    >
                        <ListItem arrow="horizontal">
                            <FormattedMessage id="Customer-Order-time" />
                        </ListItem>
                    </Picker>
                    <InputItem
                        {...getFieldProps('count', {
                            initialValue: seatcount,
                            rules: [
                                { required: true, message: '请填写人数' },
                            ],
                        }) }
                        placeholder="请填写人数"
                        type="number"
                        value={seatcount}
                        disabled={!!initDate}
                        maxLength={3}
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-count" />
                        </ListItem>
                    </InputItem>
                    <InputItem
                        {...getFieldProps('contactname', {
                            rules: [
                                { required: true, message: '请填写姓名' },
                            ],
                        }) }
                        error={!!getFieldError('contactname')}
                        placeholder="请填写姓名"
                        clear
                        maxLength={20}
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-contactname" />
                        </ListItem>
                    </InputItem>
                    <InputItem
                        {...getFieldProps('contactmobile', {
                            rules: [
                                { required: true, message: '请填写联系方式' },
                            ],
                        }) }
                        error={!!getFieldError('contactmobile')}
                        placeholder="请填写联系方式"
                        mode="mobile"
                        clear
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-contactmobile" />
                        </ListItem>
                    </InputItem>
                    <InputItem
                        {...getFieldProps('cardNO', {
                            rules: [
                                { required: true, message: '请填写信用卡号' },
                            ],
                        }) }
                        error={!!getFieldError('cardNO')}
                        placeholder="请填写信用卡号"
                        clear
                        mode="number"
                        maxLength={32}
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-cardNO" />
                        </ListItem>
                    </InputItem>
                    <InputItem
                        {...getFieldProps('cardExpires', {
                            rules: [
                                { required: true, message: '请填写信用卡有效期' },
                            ],
                        }) }
                        error={!!getFieldError('cardExpires')}
                        placeholder="请填写信用卡有效期（MM/YY)"
                        clear
                        maxLength={32}
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-cardExpires" />
                        </ListItem>
                    </InputItem>
                    <InputItem
                        {...getFieldProps('cardCode', {
                            rules: [
                                { required: true, message: '请填写信用卡安全码' },
                            ],
                        }) }
                        error={!!getFieldError('cardCode')}
                        placeholder="请填写信用卡安全码"
                        clear
                        maxLength={32}
                    >
                        <ListItem>
                            <FormattedMessage id="Customer-Order-cardCode" />
                        </ListItem>
                    </InputItem>
                    <ListItem className="actions">
                        <Button onClick={this.onCancel} inline>
                            <FormattedMessage id="Customer-Order-brncancel" />
                        </Button>
                        <Button type="primary"
                            disabled={addOrderStatus === ActionStatus.ING}
                            loading={addOrderStatus === ActionStatus.ING}
                            onClick={this.onSubmit} inline>
                            {
                                addOrderStatus === ActionStatus.ING ?
                                    <FormattedMessage id="Customer-Order-btnbooking" /> :
                                    <FormattedMessage id="Customer-Order-btnbook" />
                            }
                        </Button>
                    </ListItem>
                </List>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        addOrderStatus: state.customer.get('addOrderStatus'),
        timeList: state.customer.get('timeList'),
        userId: state.user.getIn(['user', 'id']),
    }
}

const mapDispatchToProps = {
    getTimeList,
    addOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Order))
