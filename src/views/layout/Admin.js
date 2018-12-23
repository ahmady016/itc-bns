import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { dbActions } from "../../redux/db";
import NavBar from "./NavBar";
import Register from "../public/Register";
import Login from "../public/Login";
import ChangePassword from "../admin/ChangePassword";
import RegisterUser from "../public/RegisterUser";

class Admin extends Component {
  constructor(props) {
    super(props);
    // extract current url from routes props
    const { match: { url } } = this.props;
    // the default Route Path to Redirect to
    this.defaultPath = `${url}/login`;
    // the Nav Links [Path - text - component]
    this.navLinks = [
      { path: `${url}/change-password`, text: "تعديل كلمة المرور", component: ChangePassword },
      { path: `${url}/register-user`, text: "تسجيل حساب مستخدم", component: RegisterUser },
      { path: `${url}/register`, text: "تسجيل حساب", component: Register },
      { path: `${url}/login`, text: "تسجيل دخول", component: Login }
    ];
  }
  componentDidMount() {
    // add all realtime updates listeners
    // dbActions.mountListeners([
    //   {
    //     key: "todo",
    //     path: "todos/p6rRbuuk2stSQZ8xVaDZ"
    //   },
    //   {
    //     key: "completedFamilyTodos",
    //     path: "todos?category|==|family&completed|==|true|bool"
    //   }
    // ]);
    // remove all realtime updates listeners
    // setTimeout(dbActions.clearListeners, 5000);
  }
  componentWillUnmount() {
    // console.log("componentWillUnmount");
    // remove all realtime updates listeners
    // dbActions.clearListeners();
  }
  render() {
    return (
      <>
        <NavBar links={this.navLinks} />
        <div className="container">
          <Switch>
            {this.navLinks.map(link => <Route path={link.path} component={link.component} /> )}
            <Redirect to={this.defaultPath} />
          </Switch>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.db
});

export default connect(mapStateToProps)(Admin);
