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
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.authenticated && props.authRedirectPath !== "/home") {
      props.onSetAuthRedirectPath();
    }
  });

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
    event.preventDefault();
    props.onAuth(loginForm.email.value, loginForm.password.value, typeOfLogin);
  };

  const submitSignUpHandler = (event, typeOfLogin) => {
    event.preventDefault();
    let payload = {
      fullName: signUpForm.fullName.value,
      password: signUpForm.password.value,
      email: signUpForm.email.value,
      phoneNumber: signUpForm.phoneNumber.value,
    }
    props.onSignUp(payload, typeOfLogin);
  };

  const toggleViewPasswordHandler = () => {
    let showPasswordCopy = !showPassword;
    setShowPassword(showPasswordCopy);
  };

  let authRedirect = null;
  if (props.authenticated) {
    authRedirect = <Redirect to="/home" />;
  }

  return (
    <React.Fragment>
      {authRedirect}
      {props.location.pathname.match("/login") ? (
        <Login
          authLoginForm={loginForm}
          inputChangedHandler={loginInputChangedHandler}
          submitHandler={submitLoginHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          authError={props.authError}
        />
      ) : (
        <SignUp
          authSignUpForm={signUpForm}
          inputChangedHandler={signUpInputChangedHandler}
          submitHandler={submitSignUpHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          authError={props.authError}
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    authError: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath,
    authLoading: state.auth.loading,
    authenticated: state.firebase.auth.uid ? true : false,
    fireAuth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, typeOfLogin) =>
      dispatch(actions.auth(email, password, typeOfLogin)),
      onSignUp: (payload, typeOfSignUp) =>
      dispatch(actions.signUp(payload, typeOfSignUp)),
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Auth));
