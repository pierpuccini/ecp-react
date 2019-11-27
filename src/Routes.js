/* React imports */
import React from 'react'
import { Route, Switch, Redirect } from "react-router-dom";
/* Component imports */
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

const asyncAuth = asyncComponent(() => {
    return import("./containers/Auth/Auth");
  });
  const asyncDashboard = asyncComponent(() => {
    return import("./containers/Dashboard/Dashboard");
  });
  const asyncUsers = asyncComponent(() => {
    return import("./containers/Users/Users");
  });
  const asyncUserManangment = asyncComponent(() => {
    return import("./containers/Users/UserManagment");
  });
  const asyncClassroom = asyncComponent(() => {
    return import("./containers/Classrooms/ClassroomsContoller");
  });

const Routes = (props) => {
    const { authenticated, navRoute, pathname, role } = props;

    let routes, redirect;
    const routesArray = [
      { url: "home", comp: asyncDashboard, availableTo: ["protected","all"] },
      { url: "my-account", comp: asyncUsers, availableTo: ["protected","all"] },
      { url: "onboarding", comp: asyncUsers, availableTo: ["protected","all"] },
      { url: "classrooms", comp: asyncClassroom, availableTo: ["protected","all"] },
      { url: "user-manager", comp: asyncUserManangment, availableTo: ["protected","admin"] },
      { url: "login", comp: asyncAuth, availableTo: ["un-protected","all"] },
      { url: "sign-up", comp: asyncAuth, availableTo: ["un-protected","all"] },
      { url: "forgot-login", comp: asyncAuth, availableTo: ["un-protected","all"] }
    ];

    let urlPath = pathname;
    if (!authenticated) {
        urlPath !== "/login" &&
        urlPath !== "/sign-up" &&
        urlPath !== "/forgot-login"
          ? (redirect = <Redirect to="/login" />)
          : (redirect = null);
    }

    /* Conditional routes section */
    redirect = <Redirect to={`/${navRoute}`} />;

    //Available routes or Guarded routes
    routes = (
      <Switch>
        {routesArray.map((route, index) => {
          if (route.availableTo.includes("protected") && authenticated) {
            if (route.availableTo.includes("all")) {
              return (
                <Route
                  path={`/${route.url}`}
                  key={`/${route.url}`}
                  component={route.comp}
                />
              );
            } else if (route.availableTo.includes(role)) {
              return (
                <Route
                  path={`/${route.url}`}
                  key={`/${route.url}`}
                  component={route.comp}
                />
              );
            } else {
              return null;
            }
          } else if (route.availableTo.includes("un-protected")) {
            return (
              <Route
                path={`/${route.url}`}
                key={`/${route.url}`}
                component={route.comp}
              />
            );
          } else {
              return null
          }
        })}
        <Redirect to={(authenticated)?'/home':'/login'} />
      </Switch>
    );

    return (
        <React.Fragment>
            {redirect}
            {routes}
        </React.Fragment>
    )
}

export default Routes
