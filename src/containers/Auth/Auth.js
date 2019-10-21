//React Imports
import React, { useState, useEffect } from "react";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//React Router
import { Redirect, withRouter } from "react-router-dom";
//App Imports
import Login from "../../components/Login/Login";
import SignUp from "../../components/SignUp/SignUp";
import loader from "../../assets/loaders/educoin(B).gif";
//Personal Helpers
import { updateObject, checkValidity } from "../../shared/utility";

const Auth = props => {

  const [loginForm, setLoginForm] = useState({
    email: {
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    },
    forgotEmail: {
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    }
  });
  
  const [signUpForm, setSignUpForm] = useState({
    fullName: {
      value: "",
      validation: {
        required: true,
        isName: true
      },
      valid: false,
      touched: false
    },
    email: {
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  //Toggle for showing Password
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.googleSignUp && props.googleSignUpInfo && !props.savedGoogleInfo) {
      const {fullName, email} = props.googleSignUpInfo
      const updateFromGoogle = {
        ...signUpForm,
        fullName: {
          value: fullName,
          validation: {
            required: true,
            isName: true
          },
          valid: true,
          touched: true
        },
        email: {
          value: email,
          validation: {
            required: true,
            isEmail: true
          },
          valid: true,
          touched: true
        },
        password: {
          value: "************",
          validation: {
            required: true,
            minLength: 6
          },
          valid: true,
          touched: true
        },
      };
        setSignUpForm(updateFromGoogle);
    }
    // eslint-disable-next-line
  }, [props.location.search, props.googleSignUp, props.googleSignUpInfo, props.savedGoogleInfo, props.authError]);

  const loginInputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(loginForm, {
      [controlName]: updateObject(loginForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          loginForm[controlName].validation
        ),
        touched: true
      })
    });
    setLoginForm(updatedControls);
  };

  const signUpInputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(signUpForm, {
      [controlName]: updateObject(signUpForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          signUpForm[controlName].validation,
        ),
        touched: true
      })
    });
    setSignUpForm(updatedControls);
  };

  const submitLoginHandler = (event, typeOfLogin) => {
    let payload = {
      email: loginForm.email.value,
      password: loginForm.password.value,
    };
    event.preventDefault();
    props.onAuth(payload, typeOfLogin);
  };

  const submitSignUpHandler = (event, typeOfLogin) => {
    event.preventDefault();
    let payload = {
      fullName: signUpForm.fullName.value,
      password: signUpForm.password.value,
      email: signUpForm.email.value,
    }
    props.onSignUp(payload, typeOfLogin);
  };

  const toggleViewPasswordHandler = () => {
    let showPasswordCopy = !showPassword;
    setShowPassword(showPasswordCopy);
  };

  const clearErrors = () => {
    props.resetErrors()
  }

  let authRedirect = null;
  if (props.authenticated) {
      authRedirect = <Redirect to="/home" />;
  }

  if (props.newUser) {
    authRedirect = <Redirect to="/sign-up" />;
  }

  if (props.passwordResetSuccess) {
    setTimeout(() => {
      props.resetSuccess()
      props.history.push("/login");      
    }, 1500);
  }

  const loadingGIF = (
    <div className="App">
      <img src={loader} alt="loading..." />
    </div>
  );
  
  return (
    <React.Fragment>
      {authRedirect}
      {(props.loading)? loadingGIF : (props.location.pathname.match("/login") ||
      props.location.pathname.match("/forgot-login") ? (
        <Login
          loading={props.loading}
          authLoginForm={loginForm}
          inputChangedHandler={loginInputChangedHandler}
          submitHandler={submitLoginHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          authError={props.authError}
          passwordResetSuccess={props.passwordResetSuccess}
          forgotLogin={
            props.location.pathname.match("/forgot-login") ? true : false
          }
          clearErrors={clearErrors}
        />
      ) : (
        <SignUp
          authSignUpForm={signUpForm}
          inputChangedHandler={signUpInputChangedHandler}
          submitHandler={submitSignUpHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          authError={props.authError}
          clearErrors={clearErrors}
        />
      ))}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    savedGoogleInfo: state.auth.savedGoogleInfo,
    googleSignUp: state.auth.isGoogleSignUp,
    googleSignUpInfo: state.auth.googleSignUpInfo,
    loading: state.auth.loading,
    authError: state.auth.error,
    passwordResetSuccess: state.auth.success,
    authRedirectPath: state.auth.authRedirectPath,
    authLoading: state.auth.loading,
    authenticated: state.firebase.auth.uid && !state.auth.newUser && !state.auth.isGoogleSignUp && !state.auth.logout,
    newUser: state.auth.newUser,
    fireAuth: state.firebase.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (payload, typeOfLogin) =>
      dispatch(actions.auth(payload, typeOfLogin)),
    onSignUp: (payload, typeOfSignUp) =>
      dispatch(actions.signUp(payload, typeOfSignUp)),
    resetSuccess: () => dispatch(actions.resetSuccess()),
    resetErrors: () => dispatch(actions.resetErrors())
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Auth));
