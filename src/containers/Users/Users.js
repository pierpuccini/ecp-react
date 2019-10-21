//React Imports
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
//App Imports
import Onboarding from "../../components/Onboarding/Onboarding";
import loader from "../../assets/loaders/educoin(B).gif";

const Users = (props) => {

  useFirestoreConnect(() => [
    { collection: 'clients', where: ["active", "==", true] }
  ]);
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients)

  if (!isLoaded(clients)) {
    return (
      <div className="App">
        <img src={loader} alt="loading..." />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Onboarding clients={clients}/>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    getClients: () => console.log('pier')
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Users));
