import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { routeGuard } from '../../common/helpers';
import NavBar from "./NavBar";
import Register from "../public/Register";
import Login from "../public/Login";
import ChangePassword from "../admin/ChangePassword";
import RegisterUser from "../public/RegisterUser";
import Dashboard from "../admin/Dashboard";

class Admin extends Component {
  constructor(props) {
    super(props);
    // extract current url from routes props
    const { match: { url } } = this.props;
    // the default Route Path to Redirect to
    this.defaultPath = `${url}/dashboard`;
    // the default Login Path to Redirect to
    this.LoginPath = `${url}/login`;
    // the Nav Links [Path - text - component]
    this.routes = [
      { path: `${url}/register-user`, text: "تسجيل حساب مستخدم", component: RegisterUser, auth: false },
      { path: `${url}/register`, text: "تسجيل حساب", component: Register, auth: false },
      { path: `${url}/login`, text: "تسجيل دخول", component: Login, auth: false },
      { path: `${url}/change-password`, text: "تعديل كلمة المرور", component: ChangePassword, auth: true },
      { path: `${url}/dashboard`, text: "لوحة التحكم", component: Dashboard, auth: true },
    ];
  }
  render() {
    let routes = this.routes.map((route, i) => (
      <Route
        key={i + 1}
        path={route.path}
        render={ props => routeGuard({
          component: route.component,
          auth: route.auth,
          loginPath: this.LoginPath,
          rootAuthPath: this.defaultPath,
          props: props
          }) }
      />
    ));
    routes.push(<Redirect to={this.defaultPath} />)
    return (
      <>
        <NavBar links={this.routes} />
        <div className="container">
          <Switch>{routes}</Switch>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.db
});

export default connect(mapStateToProps)(Admin);
