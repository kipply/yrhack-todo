import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from "react";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0Pn1ZYBvqcDXHW48AHPKT6SgrG4yeH3k",
  authDomain: "todo-app-9f295.firebaseapp.com",
  projectId: "todo-app-9f295",
  storageBucket: "todo-app-9f295.appspot.com",
  messagingSenderId: "135660987934",
  appId: "1:135660987934:web:75215b8a27571ef3b5b00f",
  measurementId: "G-DQT85Z41HC"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      user
        ? setUser(user)
        : setUser(null)
    })
  })

  const [newTodo, setNewTodo] = useState();
  function addItem() {
    console.log("triggered add item", newTodo)

    if (user == null) {
      console.log("skipping because not logged in")
      return
    }
    db.collection(user.uid).add({
        name: newTodo,
        checked: false
    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    setNewTodo("")
  }


  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    if (user == null) {
      return
    }
    db.collection(user.uid).get().then((querySnapshot) => {
      var newTodoList = [] ;
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        newTodoList.push({
          id: doc.id,
          name: data.name,
          checked: data.checked
        })
      });
      setTodoList(newTodoList)
    });
  })


  var loggedInNotice = <span> You are logged in!</span>
  if (user == null) {
    loggedInNotice = <span> You are logged out </span>
  }

  return (
    <div className="App">
      <div>
        <button
          onClick={() => {
            firebase.auth().signInAnonymously();
          }}
        >
          Sign In
        </button>

        <button
          onClick={() => {
            firebase.auth().signOut()
          }}
        >
          Sign Out
        </button>
      </div>
      {loggedInNotice}

      <div>
        <input value={newTodo} placeholder="new todo item here" onChange={e => setNewTodo(e.target.value)}/>
        <button
          onClick={() => addItem()}>
          Add to todo list!
        </button>

        {todoList &&
          todoList.map((value, index) => {
            return (
              <li key={index}>
                <div>
                  <input type="checkbox" checked={value.checked} onChange={() => {
                      db.collection(user.uid).doc(value.id).update({
                        checked: !value.checked
                      })
                  }}/>
                  <span>{value.name}</span>
                </div>
              </li>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
