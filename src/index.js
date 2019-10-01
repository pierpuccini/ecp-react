//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { reactReduxFirebase } from 'react-redux-firebase'
import firebase from 'firebase'
import { firebaseReducer } from 'react-redux-firebase'
import thunk from "redux-thunk";

//App imports
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//reducers
import authReducer from './store/reducers/auth'
//checks to see if redux is available in production or not
const composeEnhancers = process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

//All reducers must be combined here
const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer
});

const firebaseConfig = {
  apiKey: "AIzaSyCE4jdBGATmhgcW30ycQyJySAQrPbu88yw",
  authDomain: "edu-coins.firebaseapp.com",
  databaseURL: "https://edu-coins.firebaseio.com",
  projectId: "edu-coins",
  storageBucket: "edu-coins.appspot.com",
  messagingSenderId: "467893607261",
  appId: "1:467893607261:web:2be3107fa44a3c1bbb26b4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// react-redux-firebase options
const config = {
  userProfile: 'users', // firebase root where user profiles are stored
  enableLogging: false, // enable/disable Firebase's database logging
}
// Add redux Firebase to compose
const createStoreWithFirebase = compose(reactReduxFirebase(firebase, config))(createStore)

const store = createStoreWithFirebase(rootReducer, composeEnhancers(applyMiddleware(thunk)))

const app = (
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
