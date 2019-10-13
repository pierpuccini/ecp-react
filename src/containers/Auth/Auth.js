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
    },
    phoneNumber: {
      value: "",
      validation: {
        required: true,
        phone: true,
        minLength: 10
      },
      valid: false,
      touched: false
    },
    verifCode: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });
  
  /* TODO: MISSING UNIVERSITY AND ID FIELDS */
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
    },
    phoneNumber: {
      value: "",
      validation: {
        required: true,
        phone: true,
        minLength: 10
      },
      valid: false,
      touched: false
    },
    verifCode: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });

  //Toggle for showing Password
  const [showPassword, setShowPassword] = useState(false);
  //Shows Phone Login Form
  const [showPhoneLogin, setshowPhoneLogin] = useState(false);

  useEffect(() => {
    if (
      props.location.search.includes("phonefail=true") ||
      props.location.search.includes("phonerefresh=true")
    ) {
      setshowPhoneLogin(true);
    }
  }, [props.location.search]);

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
      phoneNumber: loginForm.phoneNumber.value,
      verif: loginForm.verifCode.value
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
      phoneNumber: signUpForm.phoneNumber.value,
      verif: signUpForm.verifCode.value
    }
    props.onSignUp(payload, typeOfLogin);
  };

  const toggleViewPasswordHandler = () => {
    let showPasswordCopy = !showPassword;
    setShowPassword(showPasswordCopy);
  };

  const togglePhoneFormHandler = () => {
    let showPhoneCopy = !showPhoneLogin;
    setshowPhoneLogin(showPhoneCopy);
  };

  const clearErrors = () => {
    props.resetErrors()
  }

  const resetPhoneLoginHandler = () => {
    props.history.replace("/login?phonerefresh=true&phonefail=false");
    window.location.reload();
  };

  let authRedirect = null;
  if (props.authenticated) {
    if (props.phoneAuthDone) {
      props.history.replace("/home?login-method=phone")
      // window.location.reload();
    }else{
      authRedirect = <Redirect to="/home" />;
    }
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

  if (props.reloadOnPhoneAuthFail) {
    props.history.replace('/login?phonerefresh=false&phonefail=true')
    window.location.reload();
  }

  if (props.phoneLoginFailed.error) {
    props.history.replace(`/sign-up?${props.phoneLoginFailed.url}+${props.phoneLoginFailed.message}`)
    window.location.reload();
  }

  let urlErrorMessage = {message : ''};
  let message = null;
  let signInError = null;
  if (props.location.search.includes('+')) {
    message = props.location.search.split('+')
    signInError = message[0].includes('phoneloginfailed=true')
    message = message[1].replace('%20', ' ')
    urlErrorMessage.message = message.replace('%20', ' ')
  }

  const loadingGIF = (
    <div className="App">
      <img src={loader} alt="loading..." />
    </div>
  );
  
  return (
    <React.Fragment>
      {authRedirect}
      {(props.loading && !props.phoneAuthStarted)? loadingGIF : (props.location.pathname.match("/login") ||
      props.location.pathname.match("/forgot-login") ? (
        <Login
          phoneAuthLoading={(props.loading && props.phoneAuthStarted)}
          loading={props.loading}
          authLoginForm={loginForm}
          inputChangedHandler={loginInputChangedHandler}
          submitHandler={submitLoginHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          toogleViewPhoneForm={showPhoneLogin}
          togglePhoneFormHandler={togglePhoneFormHandler}
          authError={props.authError}
          passwordResetSuccess={props.passwordResetSuccess}
          forgotLogin={
            props.location.pathname.match("/forgot-login") ? true : false
          }
          clearErrors={clearErrors}
          smsSent={props.smsSent}
          resetPhoneLogin={resetPhoneLoginHandler}
        />
      ) : (
        <SignUp
          authSignUpForm={signUpForm}
          inputChangedHandler={signUpInputChangedHandler}
          submitHandler={submitSignUpHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          authError={(signInError)? urlErrorMessage : props.authError}
          clearErrors={clearErrors}
          smsSent={props.smsSent}
        />
      ))}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    phoneAuthDone: state.auth.phoneLoginDone,
    phoneLoginFailed: state.auth.createPhoneUser,
    phoneAuthStarted: state.auth.phoneAuthStarted,
    loading: state.auth.loading,
    authError: state.auth.error,
    passwordResetSuccess: state.auth.success,
    authRedirectPath: state.auth.authRedirectPath,
    authLoading: state.auth.loading,
    authenticated: state.firebase.auth.uid && !state.auth.newUser,
    newUser: state.auth.newUser,
    fireAuth: state.firebase.auth,
    smsSent: state.auth.smsSent,
    reloadOnPhoneAuthFail: state.auth.resetCaptcha
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
