import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { logout, isAuth, getLoggedUser, initSideNav } from '../../common/helpers'

// hold the current url
let currentURL = '';
// return active or not based on matching path
const setActiveNav = (url, path) => {
  return (url.includes(path)) ? 'active' : '';
}
// after logout refresh the whole app
const doLogout = (history) => async () => {
  await logout();
  history.push('/admin');
}
// render pc-nav and/or mobile-nav
const renderNav = (navLinks, id, className) => (
  <ul id={id} className={className}>
    {navLinks.map((link, i) => (
      <li key={i + 1} className={setActiveNav(currentURL, link.path)}>
        <NavLink to={link.path+(link.paramValues|| '')}>
          <i class="fas fa-hand-point-left right"></i>
          {link.text}
        </NavLink>
      </li>
    ))}
  </ul>
)
// render user-info
const renderUserInfo = (history) => (
  isAuth()
  ? <div className="user-info flex-b-40">
      <i className="fas fa-user-tie"></i>
      <span>
        {getLoggedUser().displayName}
        <a className="waves-effect" onClick={doLogout(history)}> تسجيل خروج</a>
      </span>
    </div>
  : null
)
export default class NavBar extends Component {
  componentDidMount() {
    initSideNav({ edge: 'right' });
  }
  render() {
    let { links, className, history } = this.props;
    // get the current URL
    currentURL = window.location.href;
    // remove the not needed route(s)
    links = links.filter(link => (isAuth() && link.auth) || (!isAuth() && !link.auth) );
    return (
      <>
        <nav className={className}>
          <div className="nav-wrapper flex p-rl-2">
            <a className="sidenav-trigger flex-b-5" data-target="slide-out">
              <i className="fas fa-bars"></i>
            </a>
            <div className="flex flex-b-30">
              <img src="/images/app-logo.png" alt="itc-bns logo" />
              <Link to="/" className="brand-logo">مركز تدريب علوم الحاسب</Link>
            </div>
            { renderUserInfo(history) }
          </div>
        </nav>
        { renderNav(links, "slide-out", "sidenav") }
      </>
    )
  }
}