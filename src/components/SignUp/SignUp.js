//React Imports
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import Badge from "@material-ui/core/Badge";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
//App Imports
import classes from "./SignUp.module.scss";
import gIcon from "../../assets/svg/search.svg";
import coinIcon from "../../assets/icons/educoin.ico";
import NumberFormat from "react-number-format";

const backToLogin = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const NumberFormatCustom = props => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      format="+57 (###) ###-####"
    />
  );
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

const NumberFormatPhoneCode = props => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      format="#-#-#-#-#-#"
    />
  );
};

NumberFormatPhoneCode.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

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
  },
  inputFullName: {
    "text-transform": "capitalize"
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
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
  return (
    <Container maxWidth="sm" className={classes.signUpContainer}>
      <Paper className={matClasses.paper}>
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
          <div className={classes.loginError}>{props.authError.message}</div>
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
                  ? "Please Enter a valid Full Name"
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
            <TextField
              className={matClasses.textField}
              label="Phone Number"
              placeholder="+57 (000) 000-0000"
              type="tel"
              value={props.authSignUpForm.phoneNumber.value}
              onChange={event =>
                props.inputChangedHandler(event, "phoneNumber")
              }
              margin="normal"
              variant="outlined"
              required
              error={
                !props.authSignUpForm.phoneNumber.valid &&
                props.authSignUpForm.phoneNumber.touched
              }
              helperText={
                !props.authSignUpForm.phoneNumber.valid &&
                props.authSignUpForm.phoneNumber.touched
                  ? "Please Enter a valid Phone Number"
                  : null
              }
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
            />
            {props.authSignUpForm.phoneNumber.valid &&
            props.authSignUpForm.phoneNumber.touched ? (
              <TextField
                className={matClasses.textField}
                label="SMS Code"
                placeholder="1-2-3-4-5-6"
                type="text"
                value={props.authSignUpForm.verifCode.value}
                onChange={event =>
                  props.inputChangedHandler(event, "verifCode")
                }
                margin="normal"
                variant="outlined"
                required={props.smsSent}
                disabled={!props.smsSent}
                error={
                  !props.authSignUpForm.verifCode.valid &&
                  props.authSignUpForm.verifCode.touched
                }
                helperText={
                  !props.authSignUpForm.verifCode.valid &&
                  props.authSignUpForm.verifCode.touched
                    ? "Please Enter a valid Code"
                    : null
                }
                InputProps={{
                  inputComponent: NumberFormatPhoneCode
                }}
              />
            ) : null}
            <Button
              variant="contained"
              color="primary"
              className={matClasses.button}
              type="submit"
              disabled={
                !props.authSignUpForm.fullName.valid ||
                !props.authSignUpForm.email.valid ||
                !props.authSignUpForm.password.valid ||
                !props.authSignUpForm.phoneNumber.valid
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
