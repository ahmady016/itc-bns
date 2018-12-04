import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import * as serviceWorker from './serviceWorker';
import M from 'materialize-css';
import addExtensions from './common/extensions';
import './index.css';

// AutoInit the Materialize component [which needs AutoInit]
M.AutoInit();
// add extension functions to the js base Types
addExtensions();
// render the react App
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
