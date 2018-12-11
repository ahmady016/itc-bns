import React, { Component } from 'react'
import { connect } from 'react-redux'
import { dbActions } from '../redux/db'
import logo from './logo.svg'

class Admin extends Component {
  componentDidMount() {
    dbActions.setLisenters([{
      key: "todo",
      // path: "todos"
      // path: "todos?category|==|family&completed|==|true|bool"
      path: "todos/p6rRbuuk2stSQZ8xVaDZ"
    }]);
  }
  render() {
    const { loading, error, todos } = this.props;
		console.log("​-------------------------------")
		console.log("​Admin -> render -> todos", todos)
		console.log("​-------------------------------")
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