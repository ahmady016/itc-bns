import logger from 'redux-logger';
import { dbActionTypes } from './db';
import { mapDoc, find } from '../common/firebase';

// firestore middleware
const firestore = ({ dispatch }) => next => action => {
  if (action.type !== dbActionTypes.SET_lISENTERS)
    next(action);
  else {
    action.payload.forEach(item => {
      if (item.path.includes("/")) {
        // missing => set loading true
        find(item.path)
          .onSnapshot(docRef =>
            // missing => set loading false
            dispatch({
              type: dbActionTypes.SET_ITEM,
              payload: {
                key: item.key,
                value: mapDoc(docRef)
              }
            })
          );
        // missing => dispatch ADD_LISENTERS
      } else {
        // missing => set loading true
        find(item.path)
          .onSnapshot(snapshot => {
            // missing => set loading false
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
          });
        // missing => dispatch ADD_LISENTERS
      }
    });
  }
};

// export all middlewares
export default [logger, firestore];