import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Flex, WhiteSpace, List, InputItem, Button } from 'antd-mobile'

import { getRestaurantList } from '../../redux/modules/customer'
import ActionStatus from '../../constants/ActionStatus'
import './RestaurantList.less'

const ListItem = List.Item
const FlexItem = Flex.Item

class RestaurantList extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getRestaurantList()
  }

  render() {
    return (
      <div className="restaurantlist">
        <h1>
          Sing.Fish
        </h1>
        <List renderHeader={() => '最新开放席位'}>
          <ListItem>
            Restaurant
          </ListItem>
        </List>
        <div className="footer">
          <Button type="primary" onClick={this.handleSubmit}>我的预定</Button>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  getRestaurantList
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList)
