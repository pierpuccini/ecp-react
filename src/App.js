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
import FolderIcon from "@material-ui/icons/Folder";
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
//For dark theme
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
/* component Imports */
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import "./App.css";
import Loader from "./components/Loader/PngLoader/PngLoader";
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
      display: "none"
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      position: "fixed",
      bottom: "0"
    }
  },
  container: {
    height: "85%",
    [theme.breakpoints.up("sm")]: {
      marginBottom: "0px !important"
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "76px"
    }
  }
}));

function App(props) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const { profileLoaded, newUser, onboardingSuccess, location } = props;

  const classes = useStyles();
  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

  const [drawerOpen, setdrawerOpen] = useState(false);

  const [navRoute, setNavRoute] = useState("home");

  /* Use efect handles time out for loader and conditional routes managed by state */
  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 1500);
    //Conditional Routes
    if (
      location.pathname.match("onboarding") &&
      (!profileLoaded && !(newUser === ""))
    ) {
      setNavRoute("home");
    }
    if (profileLoaded && newUser === "") {
      setNavRoute("onboarding");
    }
    if (onboardingSuccess) {
      setNavRoute("home");
    }
    return () => {
      clearTimeout(showCoinLoader);
    };
  }, [profileLoaded, newUser, onboardingSuccess, location, setNavRoute]);

  const toggleDrawer = open => {
    setdrawerOpen(open);
  };

  const handleNavChange = (event, newValue) => {
    setNavRoute(newValue);
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
    { url: "onboarding", comp: asyncUsers }
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
        <Redirect to="/home" />
      </Switch>
    );

    const bottomNavigation = (
      <BottomNavigation
        id="footer"
        className={classes.bottomNav}
        value={navRoute}
        onChange={handleNavChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeOutlinedIcon />}
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
        <SideList toggleDrawer={toggleDrawer} onChange={handleNavChange} />
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

  //In charge of handelind darkmode
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
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
