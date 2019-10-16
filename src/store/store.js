//Redux Imports
import { createStore, applyMiddleware, compose } from "redux";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore } from "redux-firestore";
//Firebase Imports
import firebaseConfig from "../firebase.config";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import thunk from "redux-thunk";
import { initialState, rootReducer } from "./rootReducer";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Inits Firestore
firebase.firestore()

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  updateProfileOnLogin: true,
  attachAuthIsReady: true,
  enableRedirectHandling: true
};

const enhancers = [
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(thunk.withExtraArgument({ getFirebase }))
];

//checks to see if redux is available in production or not
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
if (
  process.env.NODE_ENV === "development" &&
  typeof reduxDevToolsExtension === "function"
) {
  enhancers.push(reduxDevToolsExtension());
}

const composedEnhancers = compose(...enhancers);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;