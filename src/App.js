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

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
//component Imports
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import "./App.css";
import loader from "./assets/loaders/educoin(B).gif";
import Topbar from "./components/UI/Topbar/Topbar";
import SideList from './components/UI/SideList/SideList'

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
  },
  bottomNav: {
    [theme.breakpoints.up("sm")]: {
      display: 'none'
    },
    [theme.breakpoints.down("sm")]: {
      width: '100%',
      position: 'fixed',
      bottom: '0',
    }
  },
  container: {
    [theme.breakpoints.up("sm")]: {
      marginBottom: '0px !important'
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: '56px'
    }
  },
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

  const [bottomBarSelect, setbottomBarSelect] = useState('recents');

  const handleBottomBarChange = (event, newValue) => {
    setbottomBarSelect(newValue);
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
          <SideList toggleDrawer={toggleDrawer} />
        </SwipeableDrawer>
        <Toolbar className={classes.topbarSpace} />
        <Container className={classes.container}>
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
        <BottomNavigation className={classes.bottomNav} value={bottomBarSelect} onChange={handleBottomBarChange}>
          <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
        </BottomNavigation>        
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
