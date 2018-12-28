import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import store from '../common/reduxStore';
import Public from './layout/Public';
import Admin from './layout/Admin';
import './app.css';

export default () => {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/admin" component={Admin} />
            <Route path="/"      component={Public} />
          </Switch>
        </Router>
      </Provider>
      <ToastContainer autoClose={5000} pauseOnFocusLoss={true} />
    </>
  );
};