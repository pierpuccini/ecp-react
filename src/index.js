//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//Redux Imports
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { reactReduxFirebase, firebaseReducer, getFirebase } from "react-redux-firebase";
import { firestoreReducer } from 'redux-firestore'
//Firebase Imports
import firebaseConfig from "./firebase.config";
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore'
import thunk from "redux-thunk";
//App Imports
import loader from "./assets/loaders/educoin(B).gif";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//reducers
import authReducer from "./store/reducers/auth";

//checks to see if redux is available in production or not
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  updateProfileOnLogin: true,
  attachAuthIsReady: true,
  enableRedirectHandling: true
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Inits Firestore
firebase.firestore()

//All reducers must be combined here
const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

// Create store with reducers and initial state
const initialState = {}
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ getFirebase })),
    reactReduxFirebase(firebase, rrfConfig)
  )
);

let app = (
  <div className="App">
    <img src={loader} alt="loading..." />
  </div>
);
ReactDOM.render(app, document.getElementById("root"));

store.firebaseAuthIsReady.then(() => {
  setTimeout(() => {
    let app = (
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    ReactDOM.render(app, document.getElementById("root"));
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
  }, 1500);
});
