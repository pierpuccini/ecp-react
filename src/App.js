//React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
//Redux Imports
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
//Material UI Imports
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
//component Imports
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import "./App.css";
import loader from "./assets/loaders/educoin(B).gif";
import Topbar from "./components/UI/Topbar/Topbar";

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
const asyncDashboard = asyncComponent(() => {
  return import("./containers/Dashboard/Dashboard");
});

const useStyles = makeStyles(theme => ({
  topbar: {
    [theme.breakpoints.up("md")]: {
      margin: "unset"
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "5px",
      marginBottom: "5px"
    }
  },
  topbarSpace: {
    [theme.breakpoints.up("md")]: {
      height: "64px"
    },
    [theme.breakpoints.down("md")]: {
      height: "74px"
    }
  }
}));

function App(props) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const classes = useStyles();
  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

  const [drawerOpen, setdrawerOpen] = useState(false);

  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 1500);
    return () => {
      clearTimeout(showCoinLoader);
    };
  }, []);

  const toggleDrawer = (open) => {
    setdrawerOpen(open);
  };

  //Title Checker
  let title = null
  switch (props.location.pathname) {
    case "/home":
      title = `Hi, ${props.name}`
      break;
  
    default:
      break;
  }

  /* TODO: Use my own list */
  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={()=>{toggleDrawer(false)}}
      onKeyDown={()=>{toggleDrawer(false)}}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

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
            <Toolbar className={classes.topbar}>
              <Topbar
                initials={props.initials}
                logout={props.logout}
                toggleDrawer={toggleDrawer}
                drawerState={drawerOpen}
                title={title}
              />
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          open={drawerOpen}
          onClose={() => {toggleDrawer(false)}}
          onOpen={() => {toggleDrawer(true)}}
        >
          {sideList()}
        </SwipeableDrawer>
        <Toolbar className={classes.topbarSpace} />
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

const mapStateToProps = state => {
  return {
    isAuthenticated:
      state.firebase.auth.uid &&
      !state.auth.newUser &&
      !state.auth.isGoogleSignUp &&
      state.auth.isPhoneLinkSucces,
      initials: (state.firebase.profile.initials)?state.firebase.profile.initials.replace(",", ""):null,
      name: (state.firebase.profile.displayName)?state.firebase.profile.displayName:null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
