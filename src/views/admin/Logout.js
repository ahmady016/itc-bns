import React from 'react'
import { logout } from '../../common/helpers'

export default function Logout() {
  return (
    <a className="waves-effect waves-teal btn-flat"
      onClick={logout} >
      تسجيل خروج
    </a>
  )
}