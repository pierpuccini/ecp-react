//React Imports
import React from "react";
import { Link as RouterLink } from "react-router-dom";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
//App Imports
import classes from "./Login.module.scss";
import Logo from "../../components/Logo/Logo";
import gIcon from "../../assets/svg/search.svg";

const SignUpLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
const forgotLoginDetailsLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

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
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 1),
      "box-shadow": "unset"
    }
  }
}));

const Login = props => {
  const matClasses = useStyles();

  return (
    <Container maxWidth="sm" className={classes.loginContainer}>
      <Paper className={matClasses.paper}>
        <strong>Welcome</strong>
        <Logo height="85px" />
        {props.authError ? (
          <div className={classes.loginError}>
            {props.authError.customErrorMsg}
          </div>
        ) : null}
        <div className={classes.formContainer}>
          {!props.forgotLogin ? (
            <form
              className={matClasses.container}
              onSubmit={props.submitHandler}
            >
              <TextField
                className={matClasses.textField}
                label="Email"
                placeholder="Enter Your Email"
                type="Email"
                value={props.authLoginForm.email.value}
                onChange={event => props.inputChangedHandler(event, "email")}
                margin="normal"
                variant="outlined"
                required
                error={
                  !props.authLoginForm.email.valid &&
                  props.authLoginForm.email.touched
                }
                helperText={
                  !props.authLoginForm.email.valid &&
                  props.authLoginForm.email.touched
                    ? "Please Enter a valid Email"
                    : null
                }
              />
              <TextField
                className={matClasses.textField}
                label="Password"
                placeholder="Enter Your Password"
                type={props.toogleViewPassword ? "text" : "password"}
                value={props.authLoginForm.password.value}
                onChange={event => props.inputChangedHandler(event, "password")}
                margin="normal"
                variant="outlined"
                required
                error={
                  !props.authLoginForm.password.valid &&
                  props.authLoginForm.password.touched
                }
                helperText={
                  !props.authLoginForm.password.valid &&
                  props.authLoginForm.password.touched
                    ? "Please Enter a valid Password"
                    : null
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <div onClick={() => props.toggleViewPasswordHandler()}>
                        <IconButton>
                          {props.toogleViewPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
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
                  !props.authLoginForm.password.valid ||
                  !props.authLoginForm.email.valid
                }
              >
                Log In
              </Button>
            </form>
          ) : (
            <form
              className={matClasses.container}
              onSubmit={event => props.submitHandler(event, "forgot")}
            >
              <TextField
                className={matClasses.textField}
                label="Email"
                placeholder="Enter Your Email"
                type="Email"
                value={props.authLoginForm.forgotEmail.value}
                onChange={event => props.inputChangedHandler(event, "email")}
                margin="normal"
                variant="outlined"
                required
                error={
                  !props.authLoginForm.forgotEmail.valid &&
                  props.authLoginForm.forgotEmail.touched
                }
                helperText={
                  !props.authLoginForm.forgotEmail.valid &&
                  props.authLoginForm.forgotEmail.touched
                    ? "Please Enter a valid Email"
                    : null
                }
              />
              <Typography style={{ fontSize: "small" }}>
                The reset email will arrive in a few seconds.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className={matClasses.button}
                type="submit"
                disabled={!props.authLoginForm.forgotEmail.valid}
              >
                send
              </Button>
            </form>
          )}
          {!props.forgotLogin ? (
            <div className={classes.restoreLogin}>
              ¿Forgot your Login Details?{" "}
              <Link component={forgotLoginDetailsLink} to="/forgot-login">
                Get Help Here.
              </Link>
            </div>
          ) : (
            <Paper className={matClasses.paper} style={{ padding: "unset" }}>
              <div className={classes.restoreLogin}>
                ¿Need an account?{" "}
                <Link component={SignUpLink} to="/sign-up">
                  Sign Up.
                </Link>
              </div>
            </Paper>
          )}
          <div className={classes.textDivider}>
            <span>OR</span>
          </div>
          <Button
            variant="outlined"
            className={matClasses.button}
            onClick={event => props.submitHandler(event, "google")}
          >
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
      </Paper>
      {!props.forgotLogin ? (
        <Paper className={matClasses.paper}>
          <div className={classes.restoreLogin}>
            ¿Need an account?{" "}
            <Link component={SignUpLink} to="/sign-up">
              Sign Up.
            </Link>
          </div>
        </Paper>
      ) : (
        <Paper className={matClasses.paper} style={{ padding: "unset" }}>
          <div className={classes.restoreLogin}>
            ¿Remember your login info?{" "}
            <Link component={SignUpLink} to="/login">
              Go back to login.
            </Link>
          </div>
        </Paper>
      )}
    </Container>
  );
};

export default Login;
