/* React Imports */
import React from 'react'
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
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
  }
}));

const MyAccount = (props) => {
    const classes = useStyles();

    props.clients.sort((a, b) => {
        var textA = a.value.toUpperCase();
        var textB = b.value.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    return (
      <Container maxWidth="sm" className={classes.myAccountContainer}>
        <Paper className={classes.paper}>
          <Typography>My Account</Typography>
          <form className={classes.container} onSubmit={props.submitHandler}>
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
              onChange={event =>
                props.inputChangedHandler(event, "studentId")
              }
              margin="normal"
              variant="outlined"
              disabled={(props.myProfile.role !== 'admin')}
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
          </form>
        </Paper>
      </Container>
    );
}

export default MyAccount
