import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { logout, isAuth } from '../../common/helpers'


export default function NavBar({ links, className }) {
  // hold the current url
  let url = window.location.href;
  // get the last route segment
  url = url.slice(url.lastIndexOf('/')+1);
  // return active or not based on matching path
  const setActiveNav = (path) => {
    path = path.slice(path.lastIndexOf('/')+1);
    return (url === path) ? 'active' : '';
  }
  // remove the not needed route(s)
  links = links.filter(link => (isAuth() && link.auth) || (!isAuth() && !link.auth) );
  return (
    <nav className={className}>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo right">
          مركز تدريب علوم الحاسب
          </Link>
        <ul className="left hide-on-med-and-down">
          {links.map((link, i) => (
            <li key={i + 1} className={setActiveNav(link.path)}>
              <NavLink to={link.path}>{link.text}</NavLink>
            </li>
          ))}
          { isAuth() 
            ? <li><a className="waves-effect waves-teal btn-flat" onClick={logout}> تسجيل خروج</a></li>
            : null
          }
        </ul>
      </div>
    </nav>
  );
}
