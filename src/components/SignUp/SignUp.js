//React Imports
import React from 'react'
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

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
      margin: theme.spacing(2)
    }
  }));

const SignUp = (props) => {
    const matClasses = useStyles();
    return (
        <Container maxWidth="sm">
            <Paper className={matClasses.paper}>
                Sign Up
            </Paper>
        </Container>
    )
}

export default SignUp
