import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, InputItem, Button, TextareaItem, DatePicker } from 'antd-mobile'
import { createForm } from 'rc-form'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'

import { addSeat } from '../../../redux/modules/restaurant'
import ActionStatus from '../../../constants/ActionStatus'

import './AddSeat.less'

const ListItem = List.Item
const minDate = moment().set('date', 1)
const _maxDate = minDate.clone().set('month', minDate.month() + 2)
const maxDate = _maxDate.set('date', _maxDate.daysInMonth())

class AddSeat extends Component {
    constructor(props) {
        super(props)

        const { mealtime } = props.params

        this.state = {
            mealtime
        }
    }

    validateCount = (rule, value, callback) => {
        if (value && value.length > 0 && value > 0) {
            callback()
        } else {
            callback()
        }
    }

    onSubmit = () => {
        const { params, form, addSeat, restaurantIds, history } = this.props

        form.validateFields({ force: true }, (error) => {
            if (!error) {
                addSeat({
                    restaurantId: restaurantIds,
                    ...form.getFieldsValue()
                }).then(() => {
                    history.push('/restaurant/schedule')
                })
            }
        })
    }

    onCancel = () => {
        this.props.history.push('/restaurant/schedule')
    }

    render() {
        const { addSeatStatus } = this.props
        const { getFieldProps, getFieldError } = this.props.form
        const { mealtime } = this.state
        const initDate = !!mealtime ? moment(mealtime, 'YYYYMMDD') : null

        return (
            <div className="addseat">
                <form>
                    <List renderHeader={() => <FormattedMessage id="Restaurant-AddSeat-addseat-header" />}>
                        <DatePicker
                            {...getFieldProps('date', {
                                initialValue: initDate,
                                rules: [
                                    { required: true, message: '请选择日期' }
                                ],
                            }) }
                            error={!!getFieldError('date')}
                            mode="date"
                            disabled={!!initDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            format={val => val.format('YYYY-MM-DD')}
                        >
                            <ListItem>
                                <FormattedMessage id="Restaurant-AddSeat-date" />
                            </ListItem>
                        </DatePicker>
                        <DatePicker
                            {...getFieldProps('time', {
                                rules: [
                                    { required: true, message: '请选择时间' }
                                ],
                            }) }
                            mode="time"
                            error={!!getFieldError('time')}
                            format={val => val.format('HH:mm')}
                        >
                            <ListItem>
                                <FormattedMessage id="Restaurant-AddSeat-time" />
                            </ListItem>
                        </DatePicker>
                        <InputItem
                            {...getFieldProps('count', {
                                rules: [
                                    { required: true, message: '请填写人数' },
                                    { validator: this.validateCount },
                                ],
                            }) }
                            placeholder="请填写人数"
                            type="number"
                            error={!!getFieldError('count')}
                            clear
                            maxLength={3}
                        >
                            <ListItem>
                                <FormattedMessage id="Restaurant-AddSeat-count" />
                            </ListItem>
                        </InputItem>
                        <TextareaItem
                            {...getFieldProps('comments') }
                            placeholder="请填写备注"
                            title={<FormattedMessage id="Restaurant-AddSeat-comments" />}
                            autoHeight
                            maxLength={500}
                        >
                        </TextareaItem>
                        <ListItem className="actions">
                            <Button onClick={this.onCancel} inline>
                                <FormattedMessage id="Restaurant-AddSeat-btncancel" />
                            </Button>
                            <Button type="primary"
                                disabled={addSeatStatus === ActionStatus.ING}
                                loading={addSeatStatus === ActionStatus.ING}
                                onClick={this.onSubmit} inline>
                                {
                                    addSeatStatus === ActionStatus.ING ?
                                        <FormattedMessage id="Restaurant-AddSeat-btnopenseat-ing" /> :
                                        <FormattedMessage id="Restaurant-AddSeat-btnopenseat" />
                                }
                            </Button>
                        </ListItem>
                    </List>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        addSeatStatus: state.restaurant.get('addSeatStatus'),
        restaurantIds: state.user.getIn(['user', 'restaurantIds']),
    }
}

const mapDispatchToProps = {
    addSeat
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(AddSeat))
