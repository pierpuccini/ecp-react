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
import { updateObject, checkValidity } from "../../shared/utility";

const Users = (props) => {

  const [OnboardingForm, setOnboardingForm] = useState({
    institution: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false
    },
    linkCode: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false
    },

  })

  useFirestoreConnect(() => [
    { collection: 'clients', where: ["active", "==", true] }
  ]);
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);

  const OnboardingFormHandler = (event, controlName) => {
    const updatedControls = updateObject(OnboardingForm, {
      [controlName]: updateObject(OnboardingForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          OnboardingForm[controlName].validation
        ),
        touched: true
      })
    });
    setOnboardingForm(updatedControls);
  };

  if (!isLoaded(clients)) {
    return (
      <div className="App">
        <img src={loader} alt="loading..." />
      </div>
    );
  };
  return (
    <React.Fragment>
      <Onboarding
        clients={clients}
        OnboardingForm={OnboardingForm}
        OnboardingFormChanged={OnboardingFormHandler}
      />
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
