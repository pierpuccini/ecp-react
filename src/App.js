//React Imports
import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
//component Imports
import loader from "./assets/loaders/educoin(B).gif"
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
      <Route path="/auth" component={asyncAuth} />
      <Redirect to="/auth" />
    </Switch>
  );
  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route to={`${process.env.PUBLIC_URL}/home`} component={asyncDashboard}/>
        <Redirect to={`${process.env.PUBLIC_URL}/home`}/>
      </Switch>
    );
  }
  return <div className="App">{(props.isInitializing)? (<img src={loader} alt="loading..." />) : routes}</div>;
}

const mapStateToProps = state => {
  return {
    isAuthenticated: (state.firebase.auth.uid)? true : false,
    isInitializing: state.firebase.isInitializing
  };
};

export default withRouter(connect(mapStateToProps)(App));
