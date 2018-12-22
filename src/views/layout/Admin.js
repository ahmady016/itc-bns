import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { dbActions } from '../../redux/db'
import NavBar from './NavBar';
import Register from '../public/Register'
import Login from '../public/Login'
import ChangePassword from '../admin/ChangePassword'
import RegisterUser from '../public/RegisterUser';

class Admin extends Component {
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
        <NavBar />
        <div className="container">
          <Switch>
            <Route path="/admin/change-password"  component={ChangePassword} />
            <Route path="/admin/register-user"    component={RegisterUser} />
            <Route path="/admin/register"         component={Register} />
            <Route path="/admin/"                 component={Login} />
          </Switch>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.db
});

export default connect(mapStateToProps)(Admin);