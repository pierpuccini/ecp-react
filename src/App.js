//React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
//Redux Imports
import { connect } from "react-redux";
//Material UI Imports
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
//component Imports
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import "./App.css";
import loader from "./assets/loaders/educoin(B).gif";
import Topbar from "./components/Topbar/Topbar";

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
const asyncDashboard = asyncComponent(() => {
  return import("./containers/Dashboard/Dashboard");
});

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired
};

function App(props) {

  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

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

  /* Routes for non-authenticated users */
  let app = (
    <div className="App">
      <Switch>
        <Route path="/login" component={asyncAuth} />
        <Route path="/sign-up" component={asyncAuth} />
        <Route path="/forgot-login" component={asyncAuth} />
        <Redirect to="/login" />
      </Switch>
    </div>
  );
  let routes = null;
  /* Routes for authenticated users */
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

    app = (
      <React.Fragment>
        <CssBaseline />
        <ElevationScroll {...props}>
          <AppBar>
            <Toolbar>
              <Topbar/>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        <Toolbar />
        <Container>
          {routes}
          <Box my={2}>
            {[...new Array(12)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </Box>
        </Container>
      </React.Fragment>
    );
  }

  return <React.Fragment>{domReady ? app : loadingDom}</React.Fragment>;
}

const mapStateToProps = state => {
  return {
    isAuthenticated:
      state.firebase.auth.uid &&
      !state.auth.newUser &&
      !state.auth.isGoogleSignUp &&
      state.auth.isPhoneLinkSucces
  };
};

export default withRouter(connect(mapStateToProps)(App));
