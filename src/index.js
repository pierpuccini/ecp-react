//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//Redux Imports
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
  getFirebase
} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
//Firebase Imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebase.config";
//App Imports
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
//reducers
import authReducer from "./store/reducers/auth";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Inits Firestore
firebase.firestore();

const enhancers = [applyMiddleware(thunk.withExtraArgument({ getFirebase }))];

//checks to see if redux is available in production or not
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
if (
  process.env.NODE_ENV === "development" &&
  typeof reduxDevToolsExtension === "function"
) {
  enhancers.push(reduxDevToolsExtension());
}

//All reducers must be combined here
const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

//Combines enhancers
const composedEnhancers = compose(...enhancers);

// Create store with reducers and initial state
const initialState = {};
const store = createStore(rootReducer, initialState, composedEnhancers);

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  updateProfileOnLogin: true,
  attachAuthIsReady: true,
  enableRedirectHandling: true
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

let app = (
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
