//React Imports
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
//App Imports
import FloatingLoader from '../../components/Loader/FloatingLoader'
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
        minLength: 6
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

  const submitOnboardingHandler = (event) => {
    let payload = {
      institution: OnboardingForm.institution.value,
      linkCode: OnboardingForm.linkCode.value
    };
    event.preventDefault();
    props.checkOnboarding(payload);
  };
  
  let onboardingPage = (
    <Onboarding
      clients={clients}
      OnboardingForm={OnboardingForm}
      OnboardingFormChanged={OnboardingFormHandler}
      submitHandler={submitOnboardingHandler}
      error={props.codeVerifError}
    />
  );
  /* Checks if code is verified */
  if (props.codeVerifLoading) {
    onboardingPage = (
      <FloatingLoader>
        <Onboarding
          clients={clients}
          OnboardingForm={OnboardingForm}
          OnboardingFormChanged={OnboardingFormHandler}
          error={props.codeVerifError}
          submitHandler={submitOnboardingHandler}
        />
      </FloatingLoader>
    );
  } 

  /* Checks if data is loaded from firestore */
  if (!isLoaded(clients)) {
    return (
      <div className="App">
        <img src={loader} alt="loading..." />
      </div>
    );
  };
  return (
    <React.Fragment>
      {onboardingPage}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    codeVerifLoading: state.onboarding.loading,
    codeVerifError: state.onboarding.error,
    codeVerifSucces: state.onboarding.success,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkOnboarding: (payload) => dispatch(actions.checkOnboarding(payload))
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Users));
