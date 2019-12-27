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
import SnackbarLogic from "./hoc/SnackbarLogic/SnackbarLogic";
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
    sendIdToken,
    resetReduxErrors,
    logout,
    disabled
  } = props;

  const classes = useStyles();
  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);

  const [drawerOpen, setdrawerOpen] = useState(false);

  const [navRoute, setNavRoute] = useState(
    newUser === ""
      ? "onboarding"
      : location.pathname !== "/home"
      ? location.pathname.replace("/", "")
      : "home"
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
    console.log(navRoute)
    if (location.state) {
      payload = `${location.state.overwriteLocalNavState}`;
      setsnackbarPayload({
        type: "none",
        info: "none"
      });
    } else if (profileLoaded) {
      if (newUser === "") {
        payload = "onboarding";
      } else if (location.pathname.match("onboarding") && newUser !== "") {
        payload = "home";
      } else if (
        location.pathname !== "/home" &&
        !location.pathname.includes("/classrooms")
        && !location.pathname.includes("/user-manager")
      ) {
        console.log('3')
        payload = location.pathname.replace("/", "");
      }
      if (location.pathname !== "/login") {
        setsnackbarPayload({
          type: "none",
          info: "none"
        });
      }
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
  }, [navRoute, profileLoaded, newUser, onboardingSuccessLogic, location]);

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

  const setTitle = title => {
    settitleState(title);
  };

  let loadingDom = (
    <div className="App">
      <Loader />
    </div>
  );

  /* Routes for non-authenticated users */
  let app = (
    <div className="App">
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
        <SnackbarLogic
          snackbarPayload={snackbarPayload}
          setsnackbarPayload={setsnackbarPayload}
        />
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
    role: state.firebase.profile.role,
    disabled: state.firebase.profile.disabled
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
