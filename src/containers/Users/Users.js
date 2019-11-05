//React Imports
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
//App Imports
import FloatingLoader from '../../components/Loader/FloatingLoader/FloatingLoader'
import Onboarding from "../../components/Onboarding/Onboarding";
import MyAccount from "../../components/MyAccount/MyAccount";
import Loader from "../../components/Loader/PngLoader/PngLoader"
import { updateObject, checkValidity } from "../../shared/utility";

const Users = props => {
  /* Inits user container view */
  let userView;
  /* Container States */
  const [OnboardingForm, setOnboardingForm] = useState({
    institution: {
      value: "",
      validation: {
        required: true
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
    }
  });

  const [myAccountForm, setMyAccountForm] = useState({
    displayName: {
      value: props.profile.displayName,
      validation: {
        isName: true
      },
      valid: false,
      touched: false
    },
    institution: {
      value: props.profile.institution,
      validation: {},
      valid: false,
      touched: false
    },
    studentId: {
      value: props.profile.studentId,
      validation: {},
      valid: false,
      touched: false
    },
    email: {
      value: props.profile.email,
      validation: { isEmail: true },
      valid: false,
      touched: false
    },
    password: {
      value: (props.profile.email)?"*********":"",
      validation: { minLength: 6 },
      valid: false,
      touched: false
    },
    confirmPassword: {
      value: "",
      validation: { minLength: 6 },
      valid: false,
      touched: false
    }
  });

  //Old info, used in case an update occurss 
  const [previousAccInfo, setPreviousAccInfo] = useState({
    displayName: {
      value: props.profile.displayName,
    },
    institution: {
      value: props.profile.institution,
    },
    studentId: {
      value: props.profile.studentId,
    },
    email: {
      value: props.profile.email,
    }
  });
  
  //Toggle for showing Password
  const [showPassword, setShowPassword] = useState(false);

  //Toggle for reseting input feedback items
  const [removeSuccessCheck, setRemoveSuccessCheck] = useState(true);

  useEffect(() => {
    if (props.myAccountSucces) {
      setPreviousAccInfo({
        displayName: {
          value: props.profile.displayName,
        },
        institution: {
          value: props.profile.institution,
        },
        studentId: {
          value: props.profile.studentId,
        },
        email: {
          value: props.profile.email,
        }
      })
    }
  }, [props.myAccountSucces, props.profile, setPreviousAccInfo])

  /* Loads clients data from Firestore */
  useFirestoreConnect(() => [
    { collection: "clients", where: ["active", "==", true] }
  ]);
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);
  
  /* Onboarding Logic */
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

  const submitOnboardingHandler = event => {
    let payload = {
      institution: OnboardingForm.institution.value,
      linkCode: OnboardingForm.linkCode.value
    };
    event.preventDefault();
    props.checkOnboarding(payload);
  };

  /* My account logic */
  const toggleViewPasswordHandler = () => {
    let showPasswordCopy = !showPassword;
    setShowPassword(showPasswordCopy);
  };

  const myAccountInputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(myAccountForm, {
      [controlName]: updateObject(myAccountForm[controlName], {
        value: event.target.value,
        valid:
          controlName === "confirmPassword"
            ? checkPasswordChange(event.target.value)
            : checkValidity(
                event.target.value,
                myAccountForm[controlName].validation
              ),
        touched: true
      })
    });
    setMyAccountForm(updatedControls);
    setRemoveSuccessCheck(true);
  };

  const checkPasswordChange = (confirmPassword) =>{
    if(myAccountForm.password.value === confirmPassword){
      return true
    }
    return false
  }

  const updateMyAccountInfo = (event) =>{
    event.preventDefault();
    //payload will send what must be updated
    const payload = {toUpdate: [], data: {}}
    let fieldsToUpdate = Object.keys(myAccountForm);

    fieldsToUpdate.forEach((field)=>{
      if (field === 'password' || field === 'confirmPassword') {
        if (myAccountForm.confirmPassword.value) {
          payload.toUpdate.push('password')
          payload.data = {...payload.data, password: myAccountForm.password.value}
        }
      }else{
          if (myAccountForm[field].value !== previousAccInfo[field].value) {
            payload.toUpdate.push(`${field}`);
            payload.data = {...payload.data, [`${field}`]: myAccountForm[field].value}
          }
      }
    });
    if (payload.toUpdate.includes("email") && payload.toUpdate.includes("password") && (props.mainAccount !== 'password')){
      props.linkWithProvider(null,payload)
    }else{
      props.updateUser(payload)
    }
    setRemoveSuccessCheck(false);
  }

  const linkWithProvider = (provider) =>{
    props.linkWithProvider(provider);
  }
  
  const unlinkProvider = (provider) =>{
    props.unlinkProvider(provider);
  }

  /* Onboarding view */
  let onboardingPage = (
    <Onboarding
      clients={clients}
      OnboardingForm={OnboardingForm}
      OnboardingFormChanged={OnboardingFormHandler}
      submitHandler={submitOnboardingHandler}
      error={props.codeVerifError}
    />
  );
  /* My Account view */
  let myAccountPage = (
    <MyAccount
      myProfileForm={myAccountForm}
      myProfile={props.profile}
      clients={clients}
      inputChangedHandler={myAccountInputChangedHandler}
      linkWithProvider={linkWithProvider}
      unlinkProvider={unlinkProvider}
      toogleViewPassword={showPassword}
      toggleViewPasswordHandler={toggleViewPasswordHandler}
      submitHandler={updateMyAccountInfo}
      mainAccount={props.mainAccount}
      updateError={props.myAccountError}
      updatePersistentError={props.myAccountPersistentError}
      succesfullFieldChange={props.myAccountChangedFields}
      resetSuccessCheck={removeSuccessCheck}
    />
  );

  /* URL Check to see if onboarding should be loaded or my account */
  const currentPath = props.location.pathname;
  if (currentPath.match("/onboarding")) {
    userView = onboardingPage;
  } else if (currentPath.match("/my-account")) {
    userView = myAccountPage;
  }

  /* Checks if code is verified */
  let floatingLoader = null;
  if (props.codeVerifLoading || props.myAccountLoading) {
  floatingLoader = <FloatingLoader></FloatingLoader>;
  }

  /* Checks if data is loaded from firestore */
  if (!isLoaded(clients)) {
    return (
      <div className="App">
        <Loader/>
      </div>
    );
  }
  return <React.Fragment>{floatingLoader}{userView}</React.Fragment>;
};

const mapStateToProps = state => {
  return {
    codeVerifLoading: state.onboarding.loading,
    codeVerifError: state.onboarding.error,
    codeVerifSucces: state.onboarding.success,
    profile: state.firebase.profile,
    mainAccount: state.firebase.auth.providerData[0].providerId,
    myAccountLoading: state.users.loading,
    myAccountError: state.users.error,
    myAccountPersistentError: state.users.persistentErr,
    myAccountSucces: state.users.success,
    myAccountChangedFields: state.users.successfullChanges,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkOnboarding: (payload) => dispatch(actions.checkOnboarding(payload)),
    linkWithProvider: (provider, payload) => dispatch(actions.linkUser(provider, payload)),
    unlinkProvider: (provider) => dispatch(actions.unlinkUser(provider)),
    updateUser: (payload) => dispatch(actions.updateUser(payload))
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Users));
