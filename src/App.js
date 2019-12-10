/* React Imports */
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
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
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
//For dark theme
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
/* component Imports */
import "./App.css";
import Loader from "./components/UI/Loader/PngLoader/PngLoader";
import Topbar from "./components/UI/Topbar/Topbar";
import SideList from "./components/UI/SideList/SideList";
import Snackbar from "./components/UI/Snackbar/Snackbar";
import Routes from "./Routes";

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
  const {
    profileLoaded,
    isAuthenticated,
    newUser,
    location,
    history,
    role,
    name,
    onboardingSuccessLogic,
    onboardingError,
    usersError,
    classroomError,
    myAccountSuccess,
    onboardingSuccess,
    sendIdToken,
    resetReduxErrors,
    logout,
    disabled,
    userDisabled,
    deleteSuccess
  } = props;

  const classes = useStyles();
  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

  const [drawerOpen, setdrawerOpen] = useState(false);

  const [navRoute, setNavRoute] = useState(
    newUser === "" ? "onboarding" : "home"
  );

  const [snackbarPayload, setsnackbarPayload] = useState({
    type: "none",
    info: "none"
  });

  const [titleState, settitleState] = useState("Edu Coins");
  /* Use efect handles time out for loader and conditional routes managed by state */
  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 750);
    //Conditional Routes
    let payload = navRoute;
    if (profileLoaded) {
      if (newUser === "") {
        payload = "onboarding";
      } else if (location.pathname.match("onboarding") && newUser !== "") {
        payload = "home";
      } else if (location.pathname !== "/home") {
        payload = location.pathname.replace("/", "");
      }
      setsnackbarPayload({
        type: "none",
        info: "none"
      });
    }
    if (location.state) {
      payload = `${location.state.overwriteLocalNavState}`;
      setsnackbarPayload({
        type: "none",
        info: "none"
      });
    }
    if (onboardingSuccessLogic) {
      payload = "home";
      setsnackbarPayload({
        type: "none",
        info: "none"
      });
    }
    setNavRoute(payload);
    return () => {
      clearTimeout(showCoinLoader);
    };
  }, [
    navRoute,
    isAuthenticated,
    profileLoaded,
    newUser,
    onboardingSuccessLogic,
    location,
    disabled,
    logout
  ]);

  /* This use effect logs users out on disabled state */
  useEffect(() => {
    if (profileLoaded) {
      if (disabled) {
        logout(true);
      }
    }
  }, [profileLoaded, disabled, logout]);

  /* Sends the Id token on authentication only once */
  useEffect(() => {
    if (isAuthenticated) {
      sendIdToken();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  //snackbar state handler
  useEffect(() => {
    let payload = snackbarPayload;
    //error handler
    if (usersError) {
      payload = { type: "error", info: usersError };
    }
    if (onboardingError) {
      payload = { type: "error", info: onboardingError };
    }
    if (usersError) {
      payload = { type: "error", info: usersError };
    }
    if (classroomError) {
      payload = { type: "error", info: classroomError };
    }
    //success handler
    if (myAccountSuccess) {
      payload = {
        type: "success",
        info: { message: "User succesfully updated!" }
      };
    }
    if (onboardingSuccess) {
      payload = {
        type: "success",
        info: { message: "Classroom Succesfully added!" },
        duration: 10000
      };
    }
    if (deleteSuccess) {
      payload = {
        type: "success",
        info: { message: "Classroom Succesfully deleted!" },
        duration: 10000
      };
    }
    //warnings handler
    if (userDisabled) {
      payload = userDisabled;
    }
    // console.log("payload [app]", payload);
    setsnackbarPayload(payload);
    //missing dep: snackbarPayload
    // eslint-disable-next-line
  }, [
    isAuthenticated,
    usersError,
    onboardingError,
    usersError,
    classroomError,
    myAccountSuccess,
    onboardingSuccess,
    disabled,
    userDisabled,
    deleteSuccess
  ]);

  const toggleDrawer = open => {
    setdrawerOpen(open);
  };

  const handleNavChange = (event, newValue) => {
    resetReduxErrors();
    if (newValue === "home") {
      history.push({ state: { overwriteLocalNavState: newValue } });
    } else {
      setNavRoute(newValue);
    }
    setsnackbarPayload({
      type: "none",
      info: "none"
    });
  };

  const sideListHandleNavChange = (event, newValue) => {
    resetReduxErrors();
    history.push({ state: { overwriteLocalNavState: newValue } });
  };

  const logoutHandler = () => {
    setDomReady(true);
    setdrawerOpen(false);
    logout();
  };

  let loadingDom = (
    <div className="App">
      <Loader />
    </div>
  );

  /* Routes for non-authenticated users */
  let app = (
    <div className="App">
      {snackbarPayload.type === "warning" ? (
        <Snackbar payload={snackbarPayload} />
      ) : null}
      <Routes
        authenticated={isAuthenticated}
        navRoute={navRoute}
        pathname={location.pathname}
        role={role}
      />
    </div>
  );

  /* Routes for authenticated users */
  if (isAuthenticated) {
    const setTitle = title => {
      settitleState(title);
    };

    //Loader
    app = (
      <div className="App">
        <Loader />
      </div>
    );

    //navigation
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
        <SideList
          toggleDrawer={toggleDrawer}
          onChange={sideListHandleNavChange}
        />
      </SwipeableDrawer>
    );

    app = (
      <React.Fragment>
        <Snackbar payload={snackbarPayload} />
        <CssBaseline />
        <ElevationScroll id="header" {...props}>
          <AppBar>
            <Toolbar className={classes.topbar}>
              <Topbar
                logout={logoutHandler}
                toggleDrawer={toggleDrawer}
                drawerState={drawerOpen}
                title={titleState}
                newUser={newUser === ""}
                viewAccountHandler={handleNavChange}
              />
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        {newUser === "" ? null : swipeDrawer}
        <Toolbar id="header" className={classes.topbarSpace} />
        <Container id="content" className={classes.container}>
          <Routes
            authenticated={isAuthenticated}
            navRoute={navRoute}
            pathname={location.pathname}
            role={role}
            name={name}
            setTitle={setTitle}
          />
        </Container>
        {newUser === "" ? null : bottomNavigation}
      </React.Fragment>
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
              "&:-webkit-autofill": {
                "border-radius": "4px",
                "-webkit-box-shadow": "0 0 0px  #fff inset"
              }
            }
          }
        }
      }),
    [prefersDarkMode]
  );

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        {domReady && profileLoaded ? app : loadingDom}
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
    onboardingSuccessLogic: state.onboarding.success,
    onboardingError: state.onboarding.error,
    usersError: state.users.error,
    classroomError: state.classrooms.error,
    onboardingSuccess: state.onboarding.showSuccess,
    myAccountSuccess: state.users.success,
    deleteSuccess: state.classrooms.deleteSuccess,
    role: state.firebase.profile.role,
    disabled: state.firebase.profile.disabled,
    userDisabled: state.users.warning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: disabledUser => dispatch(actions.authLogout(disabledUser)),
    resetReduxErrors: () => {
      dispatch(actions.resetErrors());
      dispatch(actions.resetUserErrors());
    },
    sendIdToken: () => {
      dispatch(actions.sendIdToken());
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
