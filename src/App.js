//React Imports
import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
//component Imports
import "./App.css";
import loader from "./assets/loaders/educoin(B).gif";

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
const asyncDashboard = asyncComponent(() => {
  return import("./containers/Dashboard/Dashboard");
});

function App(props) {

  const [domReady, setDomReady] = useState(false)

  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 1500);
    return () => {
      clearTimeout(showCoinLoader);
    };
  }, []);

  let loadingDom = (
    <div className="App">
      <img src={loader} alt="loading..." />
    </div>
  );

  let routes = (
    <Switch>
      <Route path="/login" component={asyncAuth} />
      <Route path="/sign-up" component={asyncAuth} />
      <Route path="/forgot-login" component={asyncAuth} />
      <Redirect to="/login" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/login" component={asyncAuth} />
        <Route path="/forgot-login" component={asyncAuth} />
        <Route path="/sign-up" component={asyncAuth} />
        <Route
          to={`${process.env.PUBLIC_URL}/home`}
          component={asyncDashboard}
        />
        <Redirect to={`${process.env.PUBLIC_URL}/home`} />
      </Switch>
    );
  }
  return <div className="App">{(domReady)?routes:loadingDom}</div>;
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.firebase.auth.uid && !state.auth.newUser && !state.auth.isGoogleSignUp,
    isInitializing: state.firebase.isInitializing
  };
};

export default withRouter(connect(mapStateToProps)(App));
