/* React Imports */
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
/* Redux Imports */
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
//For dark theme
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
/* component Imports */
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import "./App.css";
import Loader from "./components/UI/Loader/PngLoader/PngLoader";
import Topbar from "./components/UI/Topbar/Topbar";
import SideList from "./components/UI/SideList/SideList";

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
const asyncDashboard = asyncComponent(() => {
  return import("./containers/Dashboard/Dashboard");
});
const asyncUsers = asyncComponent(() => {
  return import("./containers/Users/Users");
});
const asyncClassroom = asyncComponent(() => {
  return import("./containers/Classrooms/ClassroomsContoller");
});

const useStyles = makeStyles(theme => ({
  bottomNav: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      position: "fixed",
      bottom: "0"
    }
  },
  container: {
    [theme.breakpoints.up("sm")]: {
      marginBottom: "0px !important"
    }
  }
}));

function App(props) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const { profileLoaded, newUser, onboardingSuccess, location, history, sendIdToken } = props;

  const classes = useStyles();
  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

  const [drawerOpen, setdrawerOpen] = useState(false);

  const [navRoute, setNavRoute] = useState("home");

  /* Use efect handles time out for loader and conditional routes managed by state */  
  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 750);
    //Conditional Routes
    if (profileLoaded) {
      if (newUser === "") {
        setNavRoute("onboarding");
      }  
      if (location.pathname.match("onboarding") && !(newUser === "")) {
        setNavRoute("home");
    }
    }
    if (location.pathname !== '/home') {
      setNavRoute(location.pathname.replace('/',''));
    }
    if(location.state) {
      setNavRoute(`${location.state.overwriteLocalNavState}`);
    }
    if (onboardingSuccess) {
      setNavRoute("home");
    }
    return () => {
      clearTimeout(showCoinLoader);
    };
  }, [profileLoaded, newUser, onboardingSuccess, location, setNavRoute]);

  /* Sends the Id token on authentication only once */
  useEffect(() => {
    if (props.isAuthenticated) {
      console.log('sending token');
      sendIdToken()
    }
  }, [props.isAuthenticated])

  const toggleDrawer = open => {
    setdrawerOpen(open);
  };

  const handleNavChange = (event, newValue) => {
    props.resetReduxErrors()
    setNavRoute(newValue);
  };

  const sideListHandleNavChange = (event, newValue) => {
    props.resetReduxErrors()
    history.push({state: {overwriteLocalNavState: newValue}});
  };

  const logoutHandler = () => {
    setDomReady(true);
    setdrawerOpen(false);
    props.logout();
  };

  let loadingDom = (
    <div className="App">
      <Loader/>
    </div>
  );

  /* Define new routes in routes array with their url and corresponding component */
  let routes, redirect, app;
  const routesArray = [
    { url: "home", comp: asyncDashboard },
    { url: "my-account", comp: asyncUsers },
    { url: "onboarding", comp: asyncUsers },
    { url: "classrooms", comp: asyncClassroom }
  ];
  /* Routes for authenticated users */
  if (props.isAuthenticated) {
    /* Conditional routes section */
    redirect = <Redirect to={`/${navRoute}`} />;

    //Title Checker
    let title = null;
    switch (props.location.pathname) {
      case "/home":
        title = `Welcome Back, ${props.name}`;
        break;

      case "/onboarding":
        title = `Welcome ${props.name}`;
        break;

      default:
        title = "Edu Coins";
        break;
    }
    //Loader
    app = (
      <div className="App">
        <Loader />
      </div>
    );
    //Available routes or Guarded routes
    routes = (
      <Switch>
        {routesArray.map(route => {
          return (
            <Route
              path={`/${route.url}`}
              key={`/${route.url}`}
              component={route.comp}
            />
          );
        })}
        <Redirect to="home" />
      </Switch>
    );

    const bottomNavigation = (
      <BottomNavigation
        id="footer"
        className={classes.bottomNav}
        value={navRoute}
        onChange={handleNavChange}
        showLabels
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Wallet"
          value="balance"
          icon={<AccountBalanceWalletOutlinedIcon />}
        />
        <BottomNavigationAction
          label="File Archive"
          value="file-archive"
          icon={<FolderOutlinedIcon />}
        />
      </BottomNavigation>
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
        <SideList toggleDrawer={toggleDrawer} onChange={sideListHandleNavChange} />
      </SwipeableDrawer>
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
                logout={logoutHandler}
                toggleDrawer={toggleDrawer}
                drawerState={drawerOpen}
                title={title}
                newUser={props.newUser === ""}
                viewAccountHandler={handleNavChange}
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

  //In charge of handeling darkmode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light"
        },
        overrides: {
          MuiInputBase: {
            input: {
              '&:-webkit-autofill': {
                'border-radius': '4px',
                '-webkit-box-shadow': '0 0 0px  #fff inset'
              },
            },
          },
        }
      }),
    [prefersDarkMode]
  );

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        {domReady && props.profileLoaded ? app : loadingDom}
      </ThemeProvider>
    </React.Fragment>
  );
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
    name: state.firebase.profile.isLoaded
      ? state.firebase.profile.displayName
      : false,
    newUser: state.firebase.profile.isLoaded
      ? state.firebase.profile.role
      : false,
    onboardingSuccess: state.onboarding.success
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout()),
    resetReduxErrors: () => {
      dispatch(actions.resetErrors());
      dispatch(actions.resetUserErrors());
    },
    sendIdToken: () => {dispatch(actions.sendIdToken())}
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
