import React from 'react'
import { logout } from '../../common/helpers'

export default function Logout({ history }) {
  logout();
  history.push('/admin');
  return null;
}