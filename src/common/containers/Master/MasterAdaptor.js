import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import './Master.less'

class MasterAdaptor extends Component {
    render() {
        const { children, user } = this.props
        const userType = user.get('type')

        if (userType === 1) {
            return this.renderRestaurantMaster(user)
        }

        return (
            <div className="master-warpper">
                <div className="header">
                    <h1>{user.get('realname') || user.get('username')}</h1>
                    <a href="/logout"><FormattedMessage id="Master-MasterAdapter-logout" /></a>
                </div>
                {this.props.children}
            </div>
        )
    }

    renderRestaurantMaster(user) {
        return (
            <div className="master-warpper">
                <div className="header">
                    <h1>{user.get('realname') || user.get('username')}</h1>
                    <a href="/logout"><FormattedMessage id="Master-MasterAdapter-logout" /></a>
                </div>
                {this.props.children}
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user.get('user'),
    }
}

export default connect(mapStateToProps)(MasterAdaptor)

