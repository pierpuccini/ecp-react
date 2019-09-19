//React Imports
import React, { useState } from "react";
//App Imports
import classes from "./Auth.module.scss";
import Logo from "../../components/Logo/Logo";
// import Input from "../../components/UI/Input/Input";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import SvgIcon from '@material-ui/core/SvgIcon';
import { updateObject, checkValidity } from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  root: {
    '& > svg': {
      margin: theme.spacing(2),
    },
  },
  container: {
    display: 'grid',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
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

  const [isSignUp, setIsSignUp] = useState(true);

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

  return (
    <div className={classes.Auth}>
      <strong>Welcome</strong>
      <Logo height="85px" />
      <div className={classes.formContainer}>
        <form className={matClasses.container}>
          <TextField
            className={matClasses.textField}
            label="Email"
            placeholder="Enter Your Email"
            type="Email"
            value={authForm.email.value}
            onChange={event => inputChangedHandler(event, 'email')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            className={matClasses.textField}
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            value={authForm.password.value}
            onChange={event => inputChangedHandler(event, 'password')}
            margin="normal"
            variant="outlined"
          />
          <Button variant="contained" color="primary" className={matClasses.button}>
            Submit
          </Button>
          <div className={classes.restoreLogin}>
            Forgot your Login Details? <a href="/">Get Help Here.</a>
          </div>
          <div className={classes.textDivider}><span>OR</span></div>
          <Button variant="outlined" className={matClasses.button}>
          <div><img src="../../assets/images/search.png" alt=""/></div>
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
