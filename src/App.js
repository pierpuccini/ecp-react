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
const asyncUsers = asyncComponent(() => {
  return import("./containers/Users/Users");
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
    height: '85%',
    [theme.breakpoints.up("sm")]: {
      marginBottom: '0px !important'
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: '76px'
    }
  },
}));

function App(props) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const classes = useStyles();
  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

  const [drawerOpen, setdrawerOpen] = useState(false);

  const [initialsState, setInitialsState] = useState({initials: ''});

  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 1500);
    let initialsCreator = initialsState;
    if (Boolean(props.name)) {
      /* Extracts initials from name */
      initialsCreator = props.name.split(" ");
      let initialsArray = initialsCreator.map(name => {
        return name[0].toString().toUpperCase();
      });
      initialsArray.forEach(()=>{
        if (initialsArray.length != 2) {
          initialsArray.pop();
        } else {
          return initialsArray;
        }
      })
      initialsCreator = initialsArray.join('');
      setInitialsState({initials: initialsCreator});
      console.log("initialsCreator", initialsCreator);
    }
    return () => {
      clearTimeout(showCoinLoader);
    };
    // eslint-disable-next-line
  }, [props.name]);

  const toggleDrawer = (open) => {
    setdrawerOpen(open);
  };

  const [bottomBarSelect, setbottomBarSelect] = useState('recents');

  const handleBottomBarChange = (event, newValue) => {
    setbottomBarSelect(newValue);
  };

  let loadingDom = (
    <div className="App">
      <img src={loader} alt="loading..." />
    </div>
  );

  let routes, redirect, app
  /* Routes for authenticated users */
  if (props.isAuthenticated) {
    //Title Checker
    let title = null;
    switch (props.location.pathname) {
      case "/home":
        title = `Welcome Back, ${props.name}`;
        break;

      case "/onboarding":
        title = `Welcome ${props.name.split(" ")[0]}`;
        break;

      default:
        title = "Edu Coins";
        break;
    }
    app = (
      <div className="App">
        <img src={loader} alt="loading..." />
      </div>
    );
        
    if (props.profileLoaded && props.newUser === "") {
      redirect = <Redirect to="/onboarding" />;
    } else {
      redirect = <Redirect to="/home" />;
    }

    routes = (
      <Switch>
        <Route path="/onboarding" component={asyncUsers} />
        <Route path="/home" component={asyncDashboard} />
      </Switch>
    );

    const swipeDrawer = (
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={drawerOpen}
        onClose={() => {
          toggleDrawer(false);
        }}
        onOpen={() => {
          toggleDrawer(true);
        }}
      >
        <SideList toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
    );

    const bottomNavigation = (
      <BottomNavigation
        id="footer"
        className={classes.bottomNav}
        value={bottomBarSelect}
        onChange={handleBottomBarChange}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<FolderIcon />}
        />
      </BottomNavigation>
    );

    /* Top bar title is handled in switch statment above */
    app = (
      <React.Fragment>
        {redirect}
        <CssBaseline />
        <ElevationScroll id="header" {...props}>
          <AppBar>
            <Toolbar className={classes.topbar}>
              <Topbar
                initials={initialsState.initials}
                logout={props.logout}
                toggleDrawer={toggleDrawer}
                drawerState={drawerOpen}
                title={title}
                newUser={props.newUser === ""}
              />
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        {props.newUser === "" ? null : swipeDrawer}
        <Toolbar id="header" className={classes.topbarSpace} />
        <Container id="content" className={classes.container}>
          {routes}
        </Container>
        {props.newUser === "" ? null : bottomNavigation}
      </React.Fragment>
    );
  } /* Routes for non-authenticated users */ else {
    let urlPath = props.location.pathname;
    urlPath !== "/login" &&
    urlPath !== "/sign-up" &&
    urlPath !== "/forgot-login"
      ? (redirect = <Redirect to="/login" />)
      : (redirect = null);

    app = (
      <div className="App">
        <Switch>
          {redirect}
          <Route path="/login" component={asyncAuth} />
          <Route path="/sign-up" component={asyncAuth} />
          <Route path="/forgot-login" component={asyncAuth} />
          <Redirect to="/login" />
        </Switch>
      </div>
    );
  }

  return <React.Fragment>{(domReady && props.profileLoaded) ? app : loadingDom}</React.Fragment>;
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
      !state.auth.logout && 
      !state.auth.newUserGoogleLogin,
      profileLoaded: state.firebase.profile.isLoaded,
      name: (state.firebase.profile.isLoaded)?state.firebase.profile.displayName:false,
      newUser: (state.firebase.profile.isLoaded)?state.firebase.profile.role: false
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));