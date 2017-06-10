import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List, Button } from 'antd-mobile'

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
        return (
            <div className="restaurantlist">
                <h1>
                    Sing.Fish
                </h1>
                <List renderHeader={() => '最新开放席位'}>
                    {
                        this.props.restaurantList.map(item => {
                            return (
                                <ListItem key={item.id}>
                                    <a href={'/customer/restaurants/' + item.id}>{item.name}</a>
                                </ListItem>
                            )
                        })
                    }
                </List>
                <div className="footer">
                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>我的预定</Button>
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
