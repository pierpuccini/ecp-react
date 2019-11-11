//React imports
import React, { useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
//Redux
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";
//App imports
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";

const createClassroom = asyncComponent(() => {
  return import("./Actions/CreateClassroom");
});

const ClassroomController = props => {
  const [navRoute, setNavRoute] = useState("classrooms");
  /* Define new routes in routes array with their url and corresponding component */
  let routes;
  const routesArray = [{ url: "create", comp: createClassroom, restriction: "student" }];

  //Available routes or Guarded routes
  routes = (
    <Switch>
      {routesArray.map(route => {
        if (route.restriction !== props.role) {
          return (
            <Route
              path={`/classrooms/${route.url}`}
              key={`/classrooms/${route.url}`}
              component={route.comp}
            />
          );
        } else {
          return null;
        }
      })}
    </Switch>
  );

  return routes;
};

const mapStateToProps = state => {
  return {
    profileLoaded: state.firebase.profile.isLoaded,
    role: state.firebase.profile.role,
    institutions: state.firebase.profile.institutions,
    classrooms: state.firebase.profile.classrooms
  };
};

export default connect(mapStateToProps)(ClassroomController);
