//React Imports
import React, { useState, useEffect } from "react";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//React Router
import { Redirect } from "react-router-dom";
//Firebase Imports
import * as firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
//App Imports
import classes from "./Auth.module.scss";
import Logo from "../../components/Logo/Logo";
// import Input from "../../components/UI/Input/Input";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import loader from "../../assets/loaders/educoin(B).gif";
//Personal Helpers
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
    marginRight: theme.spacing(1),
    inputAdornedEnd: "padding: unset"
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  progress: {
    margin: theme.spacing(2),
  }
}));

const Auth = props => {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "redirect",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/home",
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
  })

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
    props.onAuth(authForm.email.value, authForm.password.value);
  };

  const toggleViewPasswordHandler = () => {
    let showPasswordCopy = !showPassword
    setShowPassword(showPasswordCopy)
  }

  let authRedirect = null;
  if (props.authenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }

  if (props.emailLoginLoading) {
   return (
     <div className={classes.loading}>
      <img src={loader} alt="loading..." />
     </div>
   );
  }else{
    return ( <div className={classes.AuthContainer}>
    <div className={classes.Auth}>
    {authRedirect}
      <strong>Welcome</strong>
      <Logo height="85px" />
      {props.authError?
        <div className={classes.loginError}>
          {props.authError.customErrorMsg}
        </div>
        :null}
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
            required
            error={!authForm.email.valid && authForm.email.touched}
            helperText={
              !authForm.email.valid && authForm.email.touched
                ? "Please Enter a valid Email"
                : null
            }
          />
          <TextField
            className={matClasses.textField}
            label="Password"
            placeholder="Enter Your Password"
            type={showPassword? 'text' : 'password'}
            value={authForm.password.value}
            onChange={event => inputChangedHandler(event, "password")}
            margin="normal"
            variant="outlined"
            required
            error={!authForm.password.valid && authForm.password.touched}
            helperText={
              !authForm.password.valid && authForm.password.touched
                ? "Please Enter a valid Password"
                : null
            }
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <div onClick={()=>toggleViewPasswordHandler()}>
                    <IconButton>
                      {showPassword? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </div>
                </InputAdornment>
               )
              }}
          />
          <Button
            variant="contained"
            color="primary"
            className={matClasses.button}
            type="submit"
            disabled={
              (!authForm.password.valid && authForm.password.touched) ||
              (!authForm.email.valid && authForm.email.touched)
            }
          >
            Log In
          </Button>
        </form>
        <div className={classes.restoreLogin}>
          ¿Forgot your Login Details? <a href="/">Get Help Here.</a>
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
    <div className={classes.Auth}>
      <div className={classes.restoreLogin}>
        ¿Need an account? <a href="/">Sign Up.</a>
      </div>
    </div>
    </div>)
  }
};

const mapStateToProps = state => {
  return {
    authError: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath,
    authenticated: (state.firebase.auth.uid)? true : false,
    emailLoginLoading: state.auth.loading,
    fireAuth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/home'))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Auth);
