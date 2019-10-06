//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { reactReduxFirebase, firebaseReducer, getFirebase } from "react-redux-firebase";
import firebaseConfig from "./firebase.config";
import firebase from "firebase/app";
import "firebase/auth";
import thunk from "redux-thunk";

//App imports
import loader from "./assets/loaders/educoin(B).gif";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//reducers

import authReducer from "./store/reducers/auth";

//checks to see if redux is available in production or not
const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

//All reducers must be combined here
const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// // react-redux-firebase options
// const config = {
//   attachAuthIsReady: true,
//   userProfile: 'users', // firebase root where user profiles are stored
//   enableLogging: false, // enable/disable Firebase's database logging
// }

// Add redux Firebase to compose
// const createStoreWithFirebase = compose(reactReduxFirebase(firebase, config))(createStore)
// const store = createStoreWithFirebase(rootReducer, composeEnhancers(applyMiddleware(thunk.withExtraArgument({ getFirebase }))))

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ getFirebase })),
    reactReduxFirebase(firebase, {
      attachAuthIsReady: true,
      enableRedirectHandling: true
    })
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
