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
  obj.createdAt = new Date(obj.createdAt.toDate());
  if (obj)
    return {
      id: docRef.id,
      ...obj
    };
  return "document not found ...";
};
const get = path => {
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
  // extract the collectionName and query from path string
  const [collectionName, query] = path.split("?");
  // extract each query item from the query string
  let [type, field, operator, value] = query.split("|");
  // convert the value string based on the given data type
  switch (type) {
    case "number":
      value = parseInt(value);
      break;
    case "date":
      value = new Date(value);
      break;
  }
  // get query using where
  return db
    .collection(collectionName)
    .where(field, operator, value)
    .get();
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
  obj.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  // add new doc with auto generated id
  if (!path.includes("/"))
    return db
      .collection(path)
      .add(obj)
      .then(docRef => docRef.get());
  // add new doc with a given id
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .set(obj)
    .then(() => get(path));
};
const update = (path, obj) => {
  // update an existing doc
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .update(obj)
    .then(() => get(path));
};
const remove = path => {
  // delete an existing doc
  const [collectionName, docId] = path.split("/");
  return db
    .collection(collectionName)
    .doc(docId)
    .delete()
    .then(() => get(path));
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
  let docRef, querySnapshot, lastDate = dateZero;
  // get first page data by starting after [dateZero]
  // setInterval( async () => {
  //   querySnapshot = await getPage("todos",5,lastDate);
  //   lastDate = querySnapshot.docs[querySnapshot.size-1].data().createdAt.toDate().toString();
  //   if (querySnapshot.size === 0)
  //     console.log("doc(s) not found ...");
  //   console.info("page docs start: =====================");  
  //   querySnapshot.forEach( docRef => console.log(mapDoc(docRef)));
  //   console.info("page docs end: =======================");
  // },10000);
  // get all orderd by created date
  // querySnapshot = await get("todos");
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
  // docRef = await get("test/2q2XKG3EBRnwVTBwPuVu")
  // console.log("Document: ",mapDoc(docRef));
  // query
  // querySnapshot = await db.collection("test").where("born","==",1992).get();
  // query
  // querySnapshot = await query("test?number|born|==|1992");
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
  // docRef = await get("test/2q2XKG3EBRnwVTBwIoOI")
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
