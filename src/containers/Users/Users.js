//React Imports
import React from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";

const Users = () => {
  return <div>Onboarding</div>;
};

const mapStateToProps = state => {
  return {
  };
};

export default withRouter(connect(mapStateToProps)(Users));
