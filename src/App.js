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
      <Route path="/auth" component={asyncAuth} />
      <Redirect to="/auth" />
    </Switch>
  );
  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        {/* <Route path="/logout" component={Logout} /> */}
        <Route to="/" exact component={asyncDashboard}/>
      </Switch>
    );
  }
  return <div className="App">{routes}</div>;
}

const mapStateToProps = state => {
  return {
    isAuthenticated: (state.firebase.auth.uid)? true : false
  };
};

export default withRouter(connect(mapStateToProps)(App));
