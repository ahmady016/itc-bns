import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar({ links }) {
  let url = window.location.href;
  url = url.slice(url.lastIndexOf('/')+1);
  const setActiveNav = (path) => {
    path = path.slice(path.lastIndexOf('/')+1);
    return (url === path) ? 'active' : '';
  }
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo right">مركز تدريب علوم الحاسب</Link>
        <ul className="left hide-on-med-and-down">
          {links.map(link => (
            <li className={setActiveNav(link.path)}>
              <NavLink to={link.path}>{link.text}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
