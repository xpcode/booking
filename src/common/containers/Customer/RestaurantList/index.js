import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, Button } from 'antd-mobile'
import { injectIntl, FormattedMessage } from 'react-intl'

import { getRestaurantList } from '../../../redux/modules/customer'
import ActionStatus from '../../../constants/ActionStatus'
import './RestaurantList.less'

const ListItem = List.Item

class RestaurantList extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getRestaurantList()
    }

    handleSubmit() {
        this.props.history.push('/customer/myorders')
    }

    render() {
        const hash = {}
        return (
            <div className="restaurantlist">
                <h1>
                    Sing.Fish
                </h1>
                <List renderHeader={() => <FormattedMessage id="Customer-RestaurantList-header" />}>
                    {
                        this.props.restaurantList.map(item => {
                            if (!hash[item.id]) {
                                hash[item.id] = true
                                return (
                                    <ListItem key={item.id + '-' + item.mealtime}>
                                        <a href={'/customer/restaurants/' + item.id + '?n=' + item.name}>{item.name}</a>
                                    </ListItem>
                                )
                            }
                            return null
                        })
                    }
                </List>
                <div className="footer">
                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                        <FormattedMessage id="Customer-RestaurantList-btnmyorders" />
                    </Button>
                </div>
            </div >
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        restaurantList: state.customer.get('restaurantList')
    }
}

const mapDispatchToProps = {
    getRestaurantList
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList)
