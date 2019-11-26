//React Imports
import React from "react";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  onboardingContainer: {
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%"
    },
    alignSelf: "center"
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 1),
      margin: theme.spacing(1, 2),
      boxShadow: "unset"
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  MuiMenuList: {
    width: "auto !important"
  },
  codeVerifError: {
    textAlign: "center",
    color: "#f44336",
    fontSize: "small"
  },
  customeHeader: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

const Onboarding = props => {
  const matClasses = useStyles();
  let { clients, OnboardingForm, OnboardingFormChanged } = props;

  clients.sort((a, b) => {
    var textA = a.value.toUpperCase();
    var textB = b.value.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  return (
    <Container className={matClasses.onboardingContainer}>
      <CssBaseline />
      <Paper className={matClasses.paper}>
        <div className={matClasses.customeHeader}>
          <Typography>
            <strong>Register your subject</strong>
          </Typography>
          <Icon>
            <MenuBookOutlinedIcon />
          </Icon>
        </div>
        <form className={matClasses.container} onSubmit={props.submitHandler}>
          <TextField
            className={matClasses.textField}
            label="Institution"
            select
            placeholder="Select Your Institution"
            value={OnboardingForm.institution.value}
            onChange={event => {
              OnboardingFormChanged(event, "institution");
            }}
            margin="normal"
            variant="outlined"
            required
          >
            {clients.map(option => (
              <MenuItem
                className={matClasses.MuiMenuList}
                key={option.id}
                value={option.id}
              >
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={matClasses.textField}
            label="Student Code"
            placeholder="Institutions student code"
            value={OnboardingForm.studentCode.value}
            onChange={event => {
              OnboardingFormChanged(event, "studentCode");
            }}
            type="text"
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            className={matClasses.textField}
            label="Unique Code"
            placeholder="Provided by your teacher"
            value={OnboardingForm.linkCode.value}
            onChange={event => {
              OnboardingFormChanged(event, "linkCode");
            }}
            type="text"
            margin="normal"
            variant="outlined"
            required
          />
          <Button
            className={matClasses.button}
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              !props.OnboardingForm.institution.valid ||
              !props.OnboardingForm.linkCode.valid ||
              !props.OnboardingForm.studentCode.valid
            }
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Onboarding;
