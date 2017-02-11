import CSSModules from 'react-css-modules'
import React from 'react'

import css from './menu.css'

const { func } = React.PropTypes

@CSSModules(css)
export default class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nextCommitter: 'Bob Ross',
      users: [
        { name: 'Bressain Dinkelman', selected: false},
        { name: 'James Walsh', selected: false },
        { name: 'Parker Holliday', selected: false },
        { name: 'Kaiden Rawlinson', selected: true },
      ]
    }
  }

  handleUserClick = user => {
    this.setState({
      users: this.state.users.map(u => u.name !== user.name ? u : { ...u, selected: !user.selected })
    })
  }

  handleClick = () => {
  }

  renderUser = user => {
    return (
      <li styleName="user" onClick={this.handleUserClick.bind(null, user)} key={user.name}>
        <input type="checkbox" checked={user.selected} readOnly/>
        <span styleName="name">{user.name}</span>
      </li>
    )
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="header">
          Next committer: {this.state.nextCommitter}
        </div>

        <div styleName="content">
          <ul styleName="users-list">
            {this.state.users.map(this.renderUser)}
          </ul>
        </div>

        <div styleName="footer">
          Footer here <button onClick={this.handleClick}>Test</button>
        </div>
      </div>
    )
  }
}