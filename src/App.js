//React Imports
import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
//component Imports
import "./App.css";

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
const asyncDashboard = asyncComponent(() => {
  return import("./containers/Dashboard/Dashboard");
});

function App(props) {
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
        <Route to={`${process.env.PUBLIC_URL}/home`} component={asyncDashboard}/>
        <Redirect to={`${process.env.PUBLIC_URL}/home`} />
      </Switch>
    );
  }
  return <div className="App">{routes}</div>;
}

const mapStateToProps = state => {
  return {
    isAuthenticated: (state.firebase.auth.uid)? true : false,
    isInitializing: state.firebase.isInitializing
  };
};

export default withRouter(connect(mapStateToProps)(App));
