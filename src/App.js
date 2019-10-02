//React Imports
import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
//component Imports
import "./App.css";

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
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
        <Route to="/" />
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

// const mapdDispatchToProps = dispatch => {
//   return {
//     onTryAutoSignup: () => dispatch(actions.authCheckState())
//   };
// };

export default withRouter(connect(mapStateToProps)(App));
// export default withRouter(connect(mapStateToProps,mapdDispatchToProps)(App));
// export default App;
