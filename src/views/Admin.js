import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dbActions } from '../redux/db'
import logo from './logo.svg'

class Admin extends Component {
  componentDidMount() {
    dbActions.mountListeners([
      {
        key: "todo",
        path: "todos/p6rRbuuk2stSQZ8xVaDZ"
      },
      {
        key: "completedFamilyTodos",
        path: "todos?category|==|family&completed|==|true|bool"
      }
    ]);
    setTimeout(dbActions.clearListeners, 5000);
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
    // remove all realtime updates listeners
    dbActions.clearListeners();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>This is the admin ...</p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.db
});

export default connect(mapStateToProps)(Admin);