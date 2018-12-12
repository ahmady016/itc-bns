import store from '../common/reduxStore';

// root state key
const stateKey = 'db'
// initial state
const initialState = {
  meta: {},
  listeners: []
}
// action types
const actionTypes = {
  MOUNT_LISTENERS: "MOUNT_LISTENERS",
  ADD_LISTENER: "ADD_LISTENER",
  CLEAR_LISTENERS: "CLEAR_LISTENERS",
  SET_META: "SET_META",
  SET_ITEM: "SET_ITEM",
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  DELETE_ITEM: "DELETE_ITEM"
}
// state updaters
const updater = {
  [actionTypes.ADD_LISTENER]: (state,payload) => ({
    ...state,
    listeners: [ ...state.listeners ,payload]
  }),
  [actionTypes.CLEAR_LISTENERS]: (state) => ({
    ...state,
    listeners: []
  }),
  [actionTypes.SET_META]: (state,payload) => ({
    ...state,
    meta: {
      ...state.meta,
      [payload.key]: {
        loading: payload.loading,
        error: payload.error
      }
    }
  }),
  [actionTypes.SET_ITEM]: (state,payload) => ({
    ...state,
    [payload.key]: payload.value
  }),
  [actionTypes.ADD_ITEM]: (state,payload) => ({
    ...state,
    [payload.key]: (state[payload.key])? [ ...state[payload.key] ,payload.value] : [payload.value]
  }),
  [actionTypes.UPDATE_ITEM]: (state,payload) => ({
    ...state,
    [payload.key]: state[payload.key].map(item => {
      if (item.id == payload.value.id)
        return payload.value;
      return item;
    })
  }),
  [actionTypes.DELETE_ITEM]: (state,payload) => ({
    ...state,
    [payload.key]: state[payload.key].filter(item => item.id != payload.value.id )
  })
}
// action dispatchers
const dbActions = {
  mountListeners: (payload) => {
    store.dispatch({
      type: actionTypes.MOUNT_LISTENERS,
      payload
    })
  },
  addListener: (payload) => {
    store.dispatch({
      type: actionTypes.ADD_LISTENER,
      payload
    })
  },
  clearListeners: () => {
    // call each unListen function in the listeners array
    store.getState().db.listeners.forEach(listener => listener());
    // empty the listeners array
    store.dispatch({ type: actionTypes.CLEAR_LISTENERS });
  },
  setMeta: (payload) => {
    store.dispatch({
      type: actionTypes.SET_META,
      payload
    })
  },
  setItem: (payload) => {
    store.dispatch({
      type: actionTypes.SET_ITEM,
      payload
    })
  },
  addItem: (payload) => {
    store.dispatch({
      type: actionTypes.ADD_ITEM,
      payload
    })
  },
  updateItem: (payload) => {
    store.dispatch({
      type: actionTypes.UPDATE_ITEM,
      payload
    })
  },
  deleteItem: (payload) => {
    store.dispatch({
      type: actionTypes.DELETE_ITEM,
      payload
    })
  }
}
// the reducer
const reducer = (state = initialState, { type, payload }) => {
  // instead of one big switch statement
  // just we call a function based on actionType [matching the updater object]
  // that will return the new state
  // if there is no matching function based on actionType, return the same state
  return (Object.keys(updater).includes(type))
    ? updater[type](state,payload)
    : state;
}
// exporting
export {
  actionTypes as dbActionTypes,
  dbActions,
  stateKey,
  reducer as default
}