import firebase from "firebase";
// seed data
const todos = [
  {
    title: "Learning GraphQL is awesome ...",
    completed: false
  },
  {
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    title: "fugiat veniam minus",
    completed: false
  },
  {
    title: "et porro tempora",
    completed: true
  },
  {
    title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
    completed: false
  },
  {
    title: "qui ullam ratione quibusdam voluptatem quia omnis",
    completed: false
  },
  {
    title: "illo expedita consequatur quia in",
    completed: false
  },
  {
    title: "quo adipisci enim quam ut ab",
    completed: true
  },
  {
    title: "molestiae perspiciatis ipsa",
    completed: false
  },
  {
    title: "illo est ratione doloremque quia maiores aut",
    completed: true
  },
  {
    title: "vero rerum temporibus dolor",
    completed: true
  },
  {
    title: "ipsa repellendus fugit nisi",
    completed: true
  },
  {
    title: "et doloremque nulla",
    completed: false
  },
  {
    title: "repellendus sunt dolores architecto voluptatum",
    completed: true
  },
  {
    title: "ab voluptatum amet voluptas",
    completed: true
  },
  {
    title: "accusamus eos facilis sint et aut voluptatem",
    completed: true
  },
  {
    title: "quo laboriosam deleniti aut qui",
    completed: true
  },
  {
    title: "dolorum est consequatur ea mollitia in culpa",
    completed: false
  },
  {
    title: "molestiae ipsa aut voluptatibus pariatur dolor nihil",
    completed: true
  },
  {
    title: "ullam nobis libero sapiente ad optio sint",
    completed: true
  },
  {
    title: "suscipit repellat esse quibusdam voluptatem incidunt",
    completed: false
  },
  {
    title: "distinctio vitae autem nihil ut molestias quo",
    completed: true
  },
  {
    title: "et itaque necessitatibus maxime molestiae qui quas velit",
    completed: false
  },
  {
    title: "adipisci non ad dicta qui amet quaerat doloribus ea",
    completed: false
  },
  {
    title: "voluptas quo tenetur perspiciatis explicabo natus",
    completed: true
  },
  {
    title: "aliquam aut quasi",
    completed: true
  },
  {
    title: "veritatis pariatur delectus",
    completed: true
  },
  {
    title: "nesciunt totam sit blanditiis sit",
    completed: false
  },
  {
    title: "laborum aut in quam",
    completed: false
  },
  {
    title:
      "nemo perspiciatis repellat ut dolor libero commodi blanditiis omnis",
    completed: true
  }
];
// the JS begining date
const dateZero = new Date(0).toString();
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
// Firestore CRUD helpers
const mapDoc = docRef => {
  const obj = docRef.data();
  if (obj) {
    obj.createdAt = (obj.createdAt)? obj.createdAt.toDate().toString("dd/mm/yyyy 00:00:00.000 AM") : null;
    obj.id = docRef.id;
    return obj;
  }
  return "document not found ...";
};
const find = path => {
  // get one doc by id
  if (path.includes("/"))
    return db.doc(path).get();
  // get all docs ordered by its created date descending
  return db
    .collection(path)
    .orderBy("createdAt", "desc")
    .get();
};
const query = path => {
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
  // execute the firestore query
  return query.get();
};
const getPage = (collectionName, pageSize, createdAfter) => {
  // get the doc(s) that created After the given date
  return db
    .collection(collectionName)
    .orderBy("createdAt", "desc")
    .startAfter(createdAfter)
    .limit(pageSize)
    .get();
};
const add = (path, obj) => {
  // add the createdAt field
  obj.createdAt = firebase.firestore.FieldValue.serverTimestamp();
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
    .then(() => find(path));
};
const update = (path, obj) => {
  // update an existing doc
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .update(obj)
    .then(() => find(path));
};
const remove = path => {
  // delete an existing doc
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .delete()
    .then(() => find(path));
};
const listen = (path) => {
  // listen on changed of one doc
  if(path.includes('/'))
    return db
      .doc(path)
      .onSnapshot(docRef => console.log(mapDoc(docRef)) );
  // listen on changed of all docs
  let _message;
  return db
    .collection(path)
    .onSnapshot( snapshot => {
      const docs = snapshot.docChanges();
      counters[path] = counters[path] ? counters[path] : 0;
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
// CRUD test
async function run() {
  // raw firestore test
  // db.collection("test").add({
  //   first: "Ali",
  //   last: "Sayed",
  //   born: 1994
  // })
  // .then(docRef => {
  //   docRef.get().then(docRef => console.log("Document added: ",{ id: docRef.id, ...docRef.data()} ))
  // })
  // .catch(error => console.error("Error adding document: ", error));
  // db.collection("test2")
  //   .doc("2q2XKG3EBRnwVTBwPuVu")
  //   .set({ first: "Shady", last: "Hessen", born: 1997 });
  let docRef,
    querySnapshot,
    lastDate = dateZero,
    page = 1,
    timerId,
    categories = ["work", "social", "personal", "fun", "family","sport"],
    _query,
    _message;
  // test change listeners
  listen("todos");
  // setTimeout(() => add("todos",{
  //   title: "play music ...",
  //   completed: false,
  //   category: "fun"
  // }), 5000);
  // listen("todos/wWap85jw9hOshZQwnNO7");
  // db.doc("todos/wWap85jw9hOshZQwnNO7")
  //   .onSnapshot(docRef => console.log(mapDoc(docRef)) );
  // setTimeout( async () => {
  //   update("todos/wWap85jw9hOshZQwnNO7", { completed: true });
  // },5000);
  // docRef = await find("todos/wWap85jw9hOshZQwnNO7");
  // console.log(mapDoc(docRef));
  // querySnapshot = await query("todos?title|==|do the needed work just in case ...");
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // querySnapshot.forEach( docRef =>  remove(`todos/${docRef.id}`) );
  // manually set listners
  // db.collection("todos")
  //   .onSnapshot( snapshot => {
  //     snapshot.docChanges().forEach( change => {
  //       switch(change.type) {
  //         case "added":
  //           _message = "Added doc: ";
  //           break;
  //         case "modified":
  //           _message = "Modified doc: ";
  //           break;
  //         case "removed":
  //           _message = "Removed doc: ";
  //           break;
  //       }
  //       console.log(_message, mapDoc(change.doc) );
  //     });
  //   });
  // setTimeout(() => add("todos",{
  //   title: "go to the needed workspace ...",
  //   completed: false,
  //   category: "work"
  // }), 5000);
  // test the query helper function
  // querySnapshot = await query("todos?category|==|family&completed|==|true|bool");
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // update doc(s) to set category field
  // querySnapshot = await find("todos");
  // querySnapshot.forEach(async todoRef => {
  //   docRef = await update(`todos/${todoRef.id}`,{ category: categories.random() });
  //   console.log("Document updated: ", mapDoc(docRef) );
  // });
  // apply multiple where [logical And]
  // _query = db.collection("todos");
  // _query = query.where("completed", "==", true);
  // _query = query.where("category", "==", "sport");
  // querySnapshot = await _query.get();
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // get first page data by starting after [dateZero]
  // timerId = setInterval( async () => {
  //   // get the page data
  //   querySnapshot = await getPage("todos",5,lastDate);
  //   // if there is no page data then cancel timer and return
  //   if (querySnapshot.size === 0) {
  //     clearInterval(timerId);
  //     return console.log("no more pages ...");
  //   }
  //   // get the lastDate from the last doc
  //   lastDate = querySnapshot.docs[querySnapshot.size-1].data().createdAt;
  //   // log the page doc(s)
  //   console.info(`"page ${page} start: ====================="`);
  //   querySnapshot.forEach( docRef => console.log(mapDoc(docRef)));
  //   console.info(`"page ${page} end: ======================="`);
  //   page++;
  // },3000);
  // get all orderd by created date
  // querySnapshot = await find("todos");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // add the seed todos
  // todos.forEach(async todo => {
  //   docRef = await add("todos",todo);
  //   console.log("Document added: ", mapDoc(docRef) );
  // });
  // add a new doc with auto generated id
  // docRef = await add("test",{
  //   first: "Ramy",
  //   last: "Mohamed",
  //   born: 1998
  // })
  // console.log("Document added: ",mapDoc(docRef) );
  // get an existing doc
  // docRef = await find("test/2q2XKG3EBRnwVTBwPuVu")
  // console.log("Document: ",mapDoc(docRef));
  // query
  // querySnapshot = await db.collection("test").where("born","==",1992).get();
  // query
  // querySnapshot = await query("test?born|==|1992|int");
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // add a new doc with a given id
  // docRef = await add("test2/BA1PEZH2eB19MhpuqKtu",{
  //   city: "Alex",
  //   email: "alex@ae.com"
  // })
  // console.log("Document added: ",mapDoc(docRef) );
  // get a non existing doc
  // docRef = await find("test/2q2XKG3EBRnwVTBwIoOI")
  // console.log("Document: ",mapDoc(docRef));
  // update a doc
  // docRef = await update("test2/BA1PEZH2eB19MhpuqKtu", {
  //   city: "Benisuef",
  //   address: "this is the address ..."
  // })
  // console.log("Document: ",mapDoc(docRef));
  // delete a doc
  // docRef = await remove("test2/BA1PEZH2eB19MhpuqKtu");
  // console.log("Document: ",mapDoc(docRef));
}
run();