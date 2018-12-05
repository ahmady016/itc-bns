import firebase from 'firebase'
import { __await } from 'tslib';

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
db.settings({
  timestampsInSnapshots: true
});
// CRUD test
// db.collection("test").add({
//   first: "Ali",
//   last: "Sayed",
//   born: 1994
// })
// .then(docRef => {
//   docRef.get().then(docRef => console.log("Document added: ",{ id: docRef.id, ...docRef.data()} ))
// })
// .catch(error => console.error("Error adding document: ", error));
const mapDoc = (docRef) => ({ id: docRef.id, ...docRef.data()});
const get = (path) => {
  if(!path.includes('/'))
    // get all docs
    if(!path.includes('?'))
      return db.collection(path).get();
    // get query using where
    else {
      const [collectionName, query] = path.split('?');
      let [type, field, operator, value] = query.split('|');
      switch(type) {
        case 'number':
          value = parseInt(value);
          break;
        case 'date':
          value = new Date(value);
          break;
      }
      return db.collection(collectionName)
              .where(field, operator, value)
              .get();
    }
  // get one doc by id
  return db.doc(path).get();
}
const add = (collectionName, obj) => {
  return db.collection(collectionName)
    .add(obj)
    .then(docRef => docRef.get())
}
async function run() {
  let docRef, querySnapshot;
  // docRef = await add("test",{
  //   first: "khaled",
  //   last: "omar",
  //   born: 1992
  // })
  // console.log("Document added: ",mapDoc(docRef) );  
  // docRef = await get("test/2q2XKG3EBRnwVTBwPuVu")
  // console.log("Document: ",mapDoc(docRef));
  // querySnapshot = await db.collection("test").where("born","==",1992).get();
  querySnapshot = await get("test?number|born|==|1992");
  if (querySnapshot.size === 0)
    console.log("doc(s) not found ...");
  querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
}
run();