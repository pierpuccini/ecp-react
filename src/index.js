//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//Redux Imports
import { Provider } from "react-redux";
import store from "./store/store";
//App Imports
import loader from "./assets/loaders/educoin(B).gif";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

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
