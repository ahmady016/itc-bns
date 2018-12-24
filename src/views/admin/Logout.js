import React, { Component } from 'react'
import { logout } from '../../common/helpers'

export default class Logout extends Component {
  componentDidMount() {
    logout();
    this.props.history.push('/admin');
  }
  render() {
    return null
  }
}