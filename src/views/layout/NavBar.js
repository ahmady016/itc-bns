import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  const setActiveNav = (path) => {
    const url = window.location.href;
    const _url = url.slice(url.lastIndexOf('/')+1);
    const _path = path.slice(path.lastIndexOf('/')+1);
    return (_url === _path) ? 'active' : '';
  }
  const links = [
    { path: "/admin/change-password", text: "تعديل كلمة المرور" },
    { path: "/admin/register-user", text: "تسجيل حساب مستخدم" },
    { path: "/admin/register", text: "تسجيل حساب" },
    { path: "/admin/", text: "تسجيل دخول" }
  ];
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
