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
// import classes from "./Auth.module.scss";
//Personal Helpers
import { updateObject, checkValidity } from "../../shared/utility";

const Auth = props => {

  const [authForm, setAuthForm] = useState({
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

  // const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.authenticated && props.authRedirectPath !== "/home") {
      props.onSetAuthRedirectPath();
    }
  });

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          authForm[controlName].validation
        ),
        touched: true
      })
    });
    setAuthForm(updatedControls);
  };

  const submitHandler = (event, typeOfLogin) => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, typeOfLogin);
  };

  const toggleViewPasswordHandler = () => {
    let showPasswordCopy = !showPassword;
    setShowPassword(showPasswordCopy);
  };

  let authRedirect = null;
  if (props.authenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }

  return (
    <div>
      {authRedirect}
      {props.location.pathname.match('/login') ? (
        <Login
          submitHandler={submitHandler}
          authLoginForm={authForm}
          inputChangedHandler={inputChangedHandler}
          toogleViewPassword={showPassword}
          toggleViewPasswordHandler={toggleViewPasswordHandler}
          authError={props.loginError}
        />
      ) : (
        <SignUp/>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loginError: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath,
    emailLoginLoading: state.auth.loading,
    authenticated: state.firebase.auth.uid ? true : false,
    fireAuth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, typeOfLogin) =>
      dispatch(actions.auth(email, password, typeOfLogin)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/home"))
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Auth));
