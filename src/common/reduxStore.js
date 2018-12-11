// Redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
// Redux DevTools
import { composeWithDevTools } from 'redux-devtools-extension'
// ReduxForm
import { reducer as formReducer } from 'redux-form'
// Redux Middlewares
import middlewares from '../redux/middlewares'

// #region import All Redux Reducers
// import all store reducers dynamically from './store' dir
const importAll = (r) => r.keys().map(r);
const allModules = importAll(require.context('../redux', false, /\.js$/));
const allReducers = allModules
      .filter(_module => _module.middlewares === undefined)
      .reduce( (reducers, _module) => {
        reducers[_module.stateKey] = _module.default;
        return reducers;
      },{});
// add the redux form reducer
allReducers.form = formReducer;
// #endregion

// #region Configure Redux Store
// combine multiple reducers
const rootReducer = combineReducers(allReducers);
// applying middleware chain functions
const middleware = applyMiddleware(...middlewares);
// define enhancers
const enhancers = composeWithDevTools(middleware);
// create the Redux Store
const store = createStore(rootReducer, enhancers);
// export the store
export default store;
// #endregion