//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//Redux Imports
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { ReactReduxFirebaseProvider, firebaseReducer, getFirebase } from "react-redux-firebase";
import { reduxFirestore, createFirestoreInstance, firestoreReducer, getFirestore } from "redux-firestore";
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
import onboardingReducer from "./store/reducers/onboarding";

// Initialize Firebase & firebase services
firebase.initializeApp(firebaseConfig);
firebase.firestore();

const enhancers = [
  applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
  reduxFirestore(firebase)
];

//checks to see if redux is available in production or not
const composedEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
// if (
//   process.env.NODE_ENV === "development" &&
//   typeof reduxDevToolsExtension === "function"
// ) {
//   enhancers.push(reduxDevToolsExtension());
// }

//All reducers must be combined here
const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

//Combines enhancers
// const composedEnhancers = compose(...enhancers);

// Create store with reducers and initial state
const initialState = {};
const store = createStore(rootReducer, initialState, composedEnhancers);

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  enableRedirectHandling: false,
  resetBeforeLogin: false,
  // enableRedirectHandling: true,
  // logErrors: (process.env.NODE_ENV === "development")?true:false
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

//CssBaseline is used to give the app a more material approach
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
