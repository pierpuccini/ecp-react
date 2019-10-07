//React Imports
import React, { useState, useEffect } from "react";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//React Router
import { Redirect } from "react-router-dom";
//App Imports
import classes from "./Auth.module.scss";
import Logo from "../../components/Logo/Logo";
import gIcon from '../../assets/svg/search.svg';
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
//Personal Helpers
import { updateObject, checkValidity } from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: "100%"
  },
  iconRoot: {
    textAlign: "center",
    padding: "4px 12px",
    width: "18px",
    height: "18px",
    "font-size": "unset"
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
    <div className={classes.AuthContainer}>
      <div className={classes.Auth}>
        {authRedirect}
        <strong>Welcome</strong>
        <Logo height="85px" />
        {props.authError ? (
          <div className={classes.loginError}>
            {props.authError.customErrorMsg}
          </div>
        ) : null}
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
              type={showPassword ? "text" : "password"}
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
                    <div onClick={() => toggleViewPasswordHandler()}>
                      <IconButton>
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
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
          <Button variant="outlined" className={matClasses.button} onClick={event => submitHandler(event, "google")}>
            <Icon classes={{ root: matClasses.iconRoot }}>
              <img
                className={matClasses.imageIcon}
                src={gIcon}
                alt="google login"
              />
            </Icon>
            <span className={classes.gLogin}>Sign in with Google</span>
          </Button>
        </div>
      </div>
      <div className={classes.Auth}>
        <div className={classes.restoreLogin}>
          ¿Need an account? <a href="/">Sign Up.</a>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    authError: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath,
    emailLoginLoading: state.auth.loading,
    authenticated: (state.firebase.auth.uid)? true : false,
    fireAuth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, typeOfLogin) => dispatch(actions.auth(email, password, typeOfLogin)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/home'))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Auth);
