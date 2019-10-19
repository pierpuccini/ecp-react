//React Imports
import React from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
//App Imports
import Onboarding from "../../components/Onboarding/Onboarding";

const Users = () => {
  return (
    <React.Fragment>
      <Onboarding />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {};
};

export default withRouter(connect(mapStateToProps)(Users));
