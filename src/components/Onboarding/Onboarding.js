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

const currencies = [
  {
    value: "USD",
    label: "$"
  },
  {
    value: "EUR",
    label: "€"
  },
  {
    value: "BTC",
    label: "฿"
  },
  {
    value: "JPY",
    label: "¥"
  }
];

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  loginContainer: {
    padding: "unset !important"
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
    marginRight: theme.spacing(1),
    inputAdornedEnd: "padding: unset"
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
  MuiMenuList:{
    width:'auto !important'
  }
}));

const Onboarding = () => {
  const matClasses = useStyles();
  return (
    <Container className={matClasses.loginContainer}>
      <CssBaseline />
      <Paper className={matClasses.paper}>
        <Typography>Onboarding</Typography>
        <form className={matClasses.container}>
          <TextField
            className={matClasses.textField}
            label="Institution"
            select
            placeholder="Select Your Institution"
            margin="normal"
            variant="outlined"
            required
          >
            {currencies.map(option => (
              <MenuItem
                className={matClasses.MuiMenuList}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={matClasses.textField}
            label="Unique Code"
            placeholder="Enter code provided by your teacher"
            type="text"
            margin="normal"
            variant="outlined"
            required
          />
          <Button
            className={matClasses.button}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Onboarding;
