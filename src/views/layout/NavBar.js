import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { logout, isAuth } from '../../common/helpers'

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
export default function NavBar({ links, className, history }) {
  // get the current URL
  currentURL = window.location.href;
  // get the last route segment from the current URL
  currentURL = currentURL.slice(currentURL.lastIndexOf('/')+1);
  // remove the not needed route(s)
  links = links.filter(link => (isAuth() && link.auth) || (!isAuth() && !link.auth) );
  return (
    <nav className={className}>
      <div className="nav-wrapper">
        <img className="right" src="/images/app-logo.png" alt="itc-bns logo" />
        <Link to="/" className="brand-logo right">
          مركز تدريب علوم الحاسب
        </Link>
        <ul className="left hide-on-med-and-down">
          {links.map((link, i) => (
            <li key={i + 1} className={setActiveNav(currentURL, link.path)}>
              <NavLink to={link.path}>{link.text}</NavLink>
            </li>
          ))}
          { isAuth()
            ? <li><a className="waves-effect waves-teal btn-flat" onClick={doLogout(history)}> تسجيل خروج</a></li>
            : null
          }
        </ul>
      </div>
    </nav>
  );
}
