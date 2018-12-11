import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from '../common/reduxStore';
import Public from './Public';
import Admin from './Admin';
import './app.css';

export default () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/" component={Public} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};