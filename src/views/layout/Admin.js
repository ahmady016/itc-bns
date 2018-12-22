import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dbActions } from '../../redux/db'
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
      <div className="container">
        {/* <RegisterUser /> */}
        <Register />
        {/* <Login /> */}
        {/* <ChangePassword /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.db
});

export default connect(mapStateToProps)(Admin);