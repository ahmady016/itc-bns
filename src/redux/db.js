import store from '../common/reduxStore';

// root state key
const stateKey = 'db'
// initial state
const initialState = {
  loading: false,
  error: '',
  lisenters: []
}
// action types
const actionTypes = {
  SET_lISENTERS: "SET_lISENTERS",
  ADD_lISENTERS: "ADD_lISENTERS",
  REMOVE_LISENTERS: "REMOVE_LISENTERS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_ITEM: "SET_ITEM",
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  DELETE_ITEM: "DELETE_ITEM"
}
// state updaters
const updater = {
  [actionTypes.ADD_lISENTERS]: (state,payload) => ({
    ...state,
    lisenters: [ ...state.lisenters ,payload]
  }),
  [actionTypes.REMOVE_LISENTERS]: (state,payload) => ({
    ...state,
    lisenters: state.lisenters.filter(item => item != payload )
  }),
  [actionTypes.SET_LOADING]: (state,payload) => ({
    ...state,
    loading: payload
  }),
  [actionTypes.SET_ERROR]: (state,payload) => ({
    ...state,
    error: payload
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
  setLisenters: (payload) => {
    store.dispatch({
      type: actionTypes.SET_lISENTERS,
      payload
    })
  },
  addLisenters: (payload) => {
    store.dispatch({
      type: actionTypes.ADD_lISENTERS,
      payload
    })
  },
  removeLisenters: (payload) => {
    store.dispatch({
      type: actionTypes.REMOVE_LISENTERS,
      payload
    })
  },
  setLoading: (payload) => {
    store.dispatch({
      type: actionTypes.SET_LOADING,
      payload
    })
  },
  setError: (payload) => {
    store.dispatch({
      type: actionTypes.SET_ERROR,
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