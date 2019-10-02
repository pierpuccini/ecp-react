//React Imports
import React, { useState } from "react";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//Firebase Imports
import * as firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
//App Imports
import classes from "./Auth.module.scss";
import Logo from "../../components/Logo/Logo";
// import Input from "../../components/UI/Input/Input";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import gIcon from "../../assets/svg/search.svg";
import Icon from "@material-ui/core/Icon";
import { updateObject, checkValidity } from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: "100%"
  },
  iconRoot: {
    textAlign: "center",
    padding: "4px 12px"
  },
  container: {
    display: "grid",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

const Auth = props => {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "redirect",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
  };

  const matClasses = useStyles();

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
      elementType: "input",
      elementConfig: {
        type: "password",
        label: "Password",
        placeholder: "Enter Your Password",
        variant: "outlined"
      },
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  const [isSignUp, setIsSignUp] = useState(false);

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

  const submitHandler = event => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
  };

  return (
    <div className={classes.Auth}>
      <strong>Welcome</strong>
      <Logo height="85px" />
      <div className={classes.formContainer}>
        <form className={matClasses.container} onSubmit={submitHandler}>
          <TextField
            className={matClasses.textField}
            label="Email"
            placeholder="Enter Your Email"
            type="Email"
            value={authForm.email.value}
            onChange={event => inputChangedHandler(event, "email")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            className={matClasses.textField}
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            value={authForm.password.value}
            onChange={event => inputChangedHandler(event, "password")}
            margin="normal"
            variant="outlined"
          />
          <Button variant="contained" color="primary" className={matClasses.button} type="submit">Log In</Button>
        </form>
        <div className={classes.restoreLogin}>
          Forgot your Login Details? <a href="/">Get Help Here.</a>
        </div>
        <div className={classes.textDivider}>
          <span>OR</span>
        </div>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
      </div>
    </div>
  );
};

// <Button variant="outlined" className={matClasses.button}>
// <Icon classes={{ root: matClasses.iconRoot }}>
//   <img className={matClasses.imageIcon} src={gIcon} />
// </Icon>
// Sign in with Google
// </Button>

const mapStateToProps = state => {
  console.log(state);
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password,isSignUp))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
