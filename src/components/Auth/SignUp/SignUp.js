/* React Imports */
import React from "react";
import { Link as RouterLink } from "react-router-dom";
/* MaterialUI Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Badge from "@material-ui/core/Badge";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
//Icons
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
/* App Imports */
import classes from "./SignUp.module.scss";
import gIcon from "../../../assets/svg/search.svg";
import coinIcon from "../../../assets/icons/educoin.ico";
import Snackbar from '../../UI/Snackbar/Snackbar';

const backToLogin = React.forwardRef((props, ref) => (
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
  iconRootCoin: {
    textAlign: "center",
    width: "32px",
    height: "32px",
    "font-size": "unset"
  },
  container: {
    display: "flex",
    flexDirection: "column"
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
  },
  inputFullName: {
    "text-transform": "capitalize"
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset",
      backgroundColor: "#ffffff"
    }
  },
  darkPaper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset",
      backgroundColor:"#303030"
    }
  },
  badge: {
    margin: theme.spacing(2)
  },
  link: {
    margin: theme.spacing(1),
  }
}));

const SignUp = props => {
  const matClasses = useStyles(); 
  const matches = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Container maxWidth="sm" className={classes.signUpContainer}>
      <Paper className={(matches)?matClasses.darkPaper:matClasses.paper}>
        <div className={classes.topActions}>
          <IconButton
            component={backToLogin}
            to="/login"
            onClick={props.clearErrors}
          >
            <ArrowBackIosOutlinedIcon />
          </IconButton>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              alignSelf: "center",
              margin: "16px"
            }}
          >
            Fill In Your Profile Info!
          </span>
          <Badge className={matClasses.badge} badgeContent={0} color="primary">
            <Icon classes={{ root: matClasses.iconRootCoin }}>
              <img
                className={matClasses.imageIcon}
                src={coinIcon}
                alt="coin counter"
              />
            </Icon>
          </Badge>
        </div>
        <div className={classes.gSignUp}>
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
            <span className={classes.gLogin}>Sign up with Google</span>
          </Button>
        </div>
        <div className={classes.textDivider}>
          <span>OR</span>
        </div>
        {props.authError ? (
          <Snackbar payload={{type: "error", info: props.authError}}/>
        ) : null}
        <div className={classes.formContainer}>
          <form className={matClasses.container} onSubmit={props.submitHandler}>
            <TextField
              className={matClasses.textField}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              value={props.authSignUpForm.fullName.value}
              onChange={event => props.inputChangedHandler(event, "fullName")}
              margin="normal"
              variant="outlined"
              required
              error={
                !props.authSignUpForm.fullName.valid &&
                props.authSignUpForm.fullName.touched
              }
              helperText={
                !props.authSignUpForm.fullName.valid &&
                props.authSignUpForm.fullName.touched
                  ? "Separate First & Last name by space"
                  : null
              }
            />
            <TextField
              className={matClasses.textField}
              label="Email"
              placeholder="JohnDoe@email.com"
              type="Email"
              value={props.authSignUpForm.email.value}
              onChange={event => props.inputChangedHandler(event, "email")}
              margin="normal"
              variant="outlined"
              required
              error={
                !props.authSignUpForm.email.valid &&
                props.authSignUpForm.email.touched
              }
              helperText={
                !props.authSignUpForm.email.valid &&
                props.authSignUpForm.email.touched
                  ? "Please Enter a valid Email"
                  : null
              }
            />
            <TextField
              className={matClasses.textField}
              label="Password"
              placeholder="John-Doe-123"
              type={props.toogleViewPassword ? "text" : "password"}
              value={props.authSignUpForm.password.value}
              onChange={event => props.inputChangedHandler(event, "password")}
              margin="normal"
              variant="outlined"
              required
              error={
                !props.authSignUpForm.password.valid &&
                props.authSignUpForm.password.touched
              }
              helperText={
                !props.authSignUpForm.password.valid &&
                props.authSignUpForm.password.touched
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
                !props.authSignUpForm.fullName.valid ||
                !props.authSignUpForm.email.valid ||
                !props.authSignUpForm.password.valid
              }
            >
              SIGN UP!
            </Button>
          </form>
          <Typography style={{ fontSize: "smaller" }}>
            *By signing up you are accepting our terms of service... Read more
            at{" "}
            <Link
              href="google.com"
              className={matClasses.link}
              target="_blank"
              rel="noopener"
            >
              www.placeholder.com
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default SignUp;
