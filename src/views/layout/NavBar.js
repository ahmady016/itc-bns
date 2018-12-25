import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { logout, isAuth, getLoggedUser, initSidenav } from '../../common/helpers'

// hold the current url
let currentURL = '';
// return active or not based on matching path
const setActiveNav = (url, path) => {
  path = path.slice(path.lastIndexOf('/')+1);
  return (url === path) ? 'active' : '';
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
        <NavLink to={link.path+(link.paramValues|| '')}>{link.text}</NavLink>
      </li>
    ))}
  </ul>
)
// render user-info
const renderUserInfo = (history) => (
  isAuth()
  ? <div className="user-info">
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
    initSidenav();
  }
  render() {
    let { links, className, history } = this.props;
    // get the current URL
    currentURL = window.location.href;
    // get the last route segment from the current URL
    currentURL = currentURL.slice(currentURL.lastIndexOf('/')+1);
    // remove the not needed route(s)
    links = links.filter(link => (isAuth() && link.auth) || (!isAuth() && !link.auth) );
    return (
      <>
        <nav className={className}>
          <div className="nav-wrapper">
            <img className="right" src="/images/app-logo.png" alt="itc-bns logo" />
            <Link to="/" className="brand-logo right">مركز تدريب علوم الحاسب</Link>
            <a className="sidenav-trigger left hide-on-large-only" data-target="mobile-nav">
              <i className="fas fa-bars"></i>
            </a>
            { renderNav(links, "pc-nav", "left hide-on-med-and-down") }
            { renderUserInfo(history) }
          </div>
        </nav>
        { renderNav(links, "mobile-nav", "sidenav") }
      </>
    )
  }
}