/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
//Animations
import Collapse from "@material-ui/core/Collapse";
//Icons
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
//App Imports
import gIcon from "../../assets/svg/search.svg";

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: "100%"
  },
  iconRoot: {
    textAlign: "center",
    marginRight: "8px",
    width: "18px",
    height: "18px",
    "font-size": "unset"
  },
  container: {
    display: "flex",
    flexDirection: "column"
  },
  myAccountContainer: {
    padding: "unset !important"
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
  MuiMenuList: {
    width: "auto !important"
  },
  gLogin: {
    textTransform: "capitalize"
  },
  submitActions: {
    display: "flex",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center"
    },
    [theme.breakpoints.up("sm")]: {
      justifyContent: "space-between"
    }
  },
  loginError: {
    textAlign: "center",
    color: "#f44336",
    fontSize: "small"
}
}));

const MyAccount = props => {
  const classes = useStyles();

  props.clients.sort((a, b) => {
    var textA = a.value.toUpperCase();
    var textB = b.value.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  
  //Error loader
  let errors = null;
  props.updatePersistentError
    ? (errors = (
        <div className={classes.loginError}>
          {props.updatePersistentError.message}
        </div>
      ))
    : props.updateError
    ? (errors = (
        <div className={classes.loginError}>{props.updateError.message}</div>
      ))
    : (errors = null);
 
  return (
    <Container maxWidth="sm" className={classes.myAccountContainer}>
      <Paper className={classes.paper}>
        <form onSubmit={props.submitHandler}>
          <Typography>My Account</Typography>
          {errors}
          <div className={classes.container}>
            <TextField
              className={classes.textField}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              value={props.myProfileForm.displayName.value}
              onChange={event =>
                props.inputChangedHandler(event, "displayName")
              }
              margin="normal"
              variant="outlined"
              error={
                !props.myProfileForm.displayName.valid &&
                props.myProfileForm.displayName.touched
              }
              helperText={
                !props.myProfileForm.displayName.valid &&
                props.myProfileForm.displayName.touched
                  ? "Separate First & Last name by space"
                  : null
              }
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              className={classes.textField}
              label="Institution"
              select
              placeholder="Select Your Institution"
              value={props.myProfileForm.institution.value}
              onChange={event => {
                props.inputChangedHandler(event, "institution");
              }}
              margin="normal"
              variant="outlined"
              disabled={props.myProfile.role === "student"}
            >
              {props.clients.map(option => (
                <MenuItem
                  className={classes.MuiMenuList}
                  key={option.id}
                  value={option.value}
                >
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className={classes.textField}
              label="Student Id"
              placeholder="200040080"
              type="number"
              value={props.myProfileForm.studentId.value}
              onChange={event => props.inputChangedHandler(event, "studentId")}
              margin="normal"
              variant="outlined"
              disabled={props.myProfile.role !== "admin"}
              error={
                !props.myProfileForm.studentId.valid &&
                props.myProfileForm.studentId.touched
              }
              helperText={
                !props.myProfileForm.studentId.valid &&
                props.myProfileForm.studentId.touched
                  ? "Add a correct Student Id"
                  : null
              }
            />
          </div>
          <Typography>Login Info</Typography>
          <div className={classes.container}>
            <TextField
              className={classes.textField}
              label="Email"
              placeholder="placeholder@mail.com"
              type="text"
              value={props.myProfileForm.email.value}
              onChange={event => props.inputChangedHandler(event, "email")}
              margin="normal"
              variant="outlined"
              error={
                !props.myProfileForm.email.valid &&
                props.myProfileForm.email.touched
              }
              helperText={
                !props.myProfileForm.email.valid &&
                props.myProfileForm.email.touched
                  ? "Please Enter a valid Email"
                  : null
              }
            />
            <TextField
              className={classes.textField}
              label="Password"
              placeholder="password"
              type={props.toogleViewPassword ? "text" : "password"}
              value={props.myProfileForm.password.value}
              onChange={event => props.inputChangedHandler(event, "password")}
              margin="normal"
              variant="outlined"
              error={
                !props.myProfileForm.password.valid &&
                props.myProfileForm.password.touched
              }
              helperText={
                !props.myProfileForm.password.valid &&
                props.myProfileForm.password.touched
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
            <Collapse
              in={
                props.myProfileForm.password.valid &&
                props.myProfileForm.password.touched
              }
            >
              <TextField
                style={{ width: "-webkit-fill-available" }}
                className={classes.textField}
                label="Confirm Password"
                placeholder="Confirm Password"
                type={props.toogleViewPassword ? "text" : "password"}
                value={props.myProfileForm.confirmPassword.value}
                onChange={event =>
                  props.inputChangedHandler(event, "confirmPassword")
                }
                margin="normal"
                variant="outlined"
                error={
                  !props.myProfileForm.confirmPassword.valid &&
                  props.myProfileForm.confirmPassword.touched
                }
                helperText={
                  !props.myProfileForm.confirmPassword.valid &&
                  props.myProfileForm.confirmPassword.touched
                    ? "Please Enter the same Password"
                    : null
                }
              />
            </Collapse>
            <div className={classes.submitActions}>
              <div>
                <Button
                  variant="outlined"
                  className={classes.button}
                  style={{ width: "210px" }}
                  onClick={() => {
                    props.myProfile.googleLink
                      ? props.unlinkProvider("google")
                      : props.linkWithProvider("google");
                  }}
                >
                  <Icon classes={{ root: classes.iconRoot }}>
                    <img
                      className={classes.imageIcon}
                      src={gIcon}
                      alt="google login"
                    />
                  </Icon>
                  <span className={classes.gLogin}>
                    {props.myProfile.googleLink
                      ? "Unlink from Google"
                      : "Link with Google"}
                  </span>
                </Button>
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "210px" }}
                className={classes.button}
                type="submit"
              >
                save changes
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default MyAccount;
