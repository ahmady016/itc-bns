import firebase from 'firebase';
import { pick } from '../common/helpers';

// the collection(s) count
const counters = {};
// the config object from the firebase server
const config = {
  apiKey: "AIzaSyDchx090iMsAOwd39dciy3XpPNbhTQ_oOk",
  authDomain: "itc-bns.firebaseapp.com",
  databaseURL: "https://itc-bns.firebaseio.com",
  projectId: "itc-bns",
  storageBucket: "itc-bns.appspot.com",
  messagingSenderId: "738109129634"
};
// initialize the firebase App with app config values
firebase.initializeApp(config);
// get the firestore db with some needed settings
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
// get the firbase Auth
const auth = firebase.auth();
// current User needed keys
export const USER_KEYS = ["uid","email","displayName","photoURL","emailVerified","isAnonymous"]

// Firebase Authentication
export const signUp = (email, password) => auth.createUserWithEmailAndPassword(email, password);
export const signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);
export const signOut = () => auth.signOut();
export const onAuthChanged = (callback) => auth.onAuthStateChanged(callback);
export const getCurrentUser = () => pick(auth.currentUser, USER_KEYS);
export const sendVerificationMail = async () => await auth.currentUser.sendEmailVerification();
export const updateProfile = async (displayName,photoURL) => await auth.currentUser.updateProfile({displayName,photoURL});
export const updatePassword = async (newPassword) => await auth.currentUser.updatePassword(newPassword);
export const updateEmail = async (newEmail) => await auth.currentUser.updateEmail(newEmail);
export const sendRestPasswordMail = async (email) => await auth.sendPasswordResetEmail(email);
export const reAuthenticate = async (password) => {
  const _user = auth.currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(_user.email, password);
  return await _user.reauthenticateAndRetrieveDataWithCredential(credentials);
};
export const register = async ({ email, password, displayName, photoURL }) => {
  await signUp(email,password);
  await updateProfile(displayName,photoURL);
  await sendVerificationMail();
  return getCurrentUser();
};
export const login = async (email, password) => {
  await signIn(email, password);
  return getCurrentUser();
};
// Firestore CRUD helpers
export const mapDoc = docRef => {
  const obj = docRef.data();
  if (obj) {
    obj.createdAt = (obj.createdAt)
            ? obj.createdAt.toDate().toString("dd/mm/yyyy 00:00:00.000 AM")
            : null;
    obj.modifiedAt = (obj.modifiedAt)
      ? obj.modifiedAt.toDate().toString("dd/mm/yyyy 00:00:00.000 AM")
      : null;
    obj.id = docRef.id;
    return obj;
  }
  return "doc not found ...";
};
export const query = path => {
  // extract the collectionName and queryString from given path
  const [collectionName, queryString] = path.split("?");
  // get the query from the target conllection
  let query = db.collection(collectionName);
  // build the firestore query
  queryString
    .split('&')
    .forEach(condition => {
      // extract each condition items from the query string
      let [field, operator, value, type] = condition.split("|");
      // convert the value string based on the given data type
      switch (type) {
        case "int":
          value = parseInt(value);
          break;
        case "float":
          value = parseFloat(value);
          break;
        case "date":
          value = new Date(value);
          break;
        case "bool":
          value = Boolean(value);
          break;
      }
      // build the query using where
      query = query.where(field, operator, value);
    })
  // return firestore query
  return query;
};
export const getPage = (collectionName, pageSize, createdAfter) => {
  // get the doc(s) that created After the given date
  return db
    .collection(collectionName)
    .orderBy("createdAt", "desc")
    .startAfter(createdAfter)
    .limit(pageSize)
    .get();
};
export const find = path => {
  // get one doc by id
  if (path.includes("/"))
    return db.doc(path);
  // get the filtered doc(s) based on queryString
  else if (path.includes("?"))
    return query(path);
  // get all docs ordered by its created date descending
  return db.collection(path).orderBy("createdAt", "desc");
};
export const add = (path, obj) => {
  // add the createdAt field
  obj.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  // add the createdBy field
  obj.createdBy = getCurrentUser().uid;
  // add new doc with auto generated id
  if (!path.includes("/"))
    return db
      .collection(path)
      .add(obj)
      // .then(docRef => docRef.get());
  // add new doc with a given id
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .set(obj)
    // .then(() => find(path));
};
export const update = (path, obj) => {
  // add the createdAt field
  obj.modifiedAt = firebase.firestore.FieldValue.serverTimestamp();
  // add the createdBy field
  obj.modifiedBy = getCurrentUser().uid;
  // update an existing doc
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .update(obj)
    // .then(() => find(path));
};
export const remove = path => {
  // delete an existing doc
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .delete()
    // .then(() => find(path));
};
export const listen = (path) => {
  // listen on change of the given doc
  if(path.includes('/'))
    return db
      .doc(path)
      .onSnapshot(docRef => console.log(mapDoc(docRef)) );
  // listen on change of all docs of the given collection
  let _message;
  return db
    .collection(path)
    .onSnapshot( snapshot => {
      counters[path] = counters[path] ? counters[path] : 0;
      const docs = snapshot.docChanges();
      docs.forEach( change => {
        switch(change.type) {
          case "added":
            _message = "Added doc: ";
            counters[path] += 1;
            break;
          case "modified":
            _message = "Modified doc: ";
            break;
          case "removed":
            _message = "Removed doc: ";
            break;
        }
        console.log(_message, mapDoc(change.doc) );
      });
      console.log("​----------------------------");
      console.log("​listen -> counters", counters);
      console.log("​----------------------------");
    });
};