import logger from 'redux-logger';
import { dbActionTypes, dbActions } from './db';
import { mapDoc, find } from '../common/firebase';

// firestore middleware
const firestore = ({ dispatch }) => next => action => {
  if (action.type !== dbActionTypes.MOUNT_LISTENERS)
    next(action);
  else {
    action.payload.forEach(item => {
      // set loading to true and error to ''
      dbActions.setMeta({ key: item.key, loading: true, error: "" });
      // if path to one doc
      if (item.path.includes("/")) {
        // get data and listen to realtime updates
        const unListen1 = find(item.path)
          .onSnapshot(docRef => {
            // set loading to false and error to ''
            dbActions.setMeta({ key: item.key, loading: false, error: "" });
            // set item with comming doc
            dispatch({
              type: dbActionTypes.SET_ITEM,
              payload: {
                key: item.key,
                value: mapDoc(docRef)
              }
            });
          }, error => {
            // set loading to false and error to the coming error
            dbActions.setMeta({ key: item.key, loading: false, error: error });
          });
        // dispatch ADD_LISENTER
        dbActions.addListener(unListen1);
      } else {
        const unListen2 = find(item.path)
          .onSnapshot(snapshot => {
            // set loading to false and error to ''
            dbActions.setMeta({ key: item.key, loading: false, error: "" });
            // [add/update/delete] item based on doc changes
            snapshot.docChanges().forEach(change => {
              switch (change.type) {
                case "added":
                  dispatch({
                    type: dbActionTypes.ADD_ITEM,
                    payload: {
                      key: item.key,
                      value: mapDoc(change.doc)
                    }
                  })
                  break;
                case "modified":
                  dispatch({
                    type: dbActionTypes.UPDATE_ITEM,
                    payload: {
                      key: item.key,
                      value: mapDoc(change.doc)
                    }
                  })
                  break;
                case "removed":
                  dispatch({
                    type: dbActionTypes.DELETE_ITEM,
                    payload: {
                      key: item.key,
                      value: mapDoc(change.doc)
                    }
                  })
                  break;
              }
            });
          }, error => {
            // set loading to false and error to the coming error
            dbActions.setMeta({ key: item.key, loading: false, error: error });
        });
        // dispatch ADD_LISENTER
        dbActions.addListener(unListen2);
      }
    });
  }
};

// export all middlewares
export default [logger, firestore];