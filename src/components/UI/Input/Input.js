//React Imports
import React from "react";
//Material Imports
// import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
// import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textFieldOutline: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  denseOutline: {
    marginTop: theme.spacing(2)
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
}));

const Input = props => {
  let inputElement = null;
  const classes = useStyles();
  let inputConfig = { ...props.elementConfig };
  //since material ui does not support error=false or true, then we must handle it with empty strings
  if (props.invalid && props.shouldValidate && props.touched) {
    inputConfig.error = " ";
  } else {
    inputConfig.error = "";
  }

  if (props.inputStyleType === "outline") {
    switch (props.elementType) {
      case "input":
        inputElement = (
          <TextField
            className={classes.textFieldOutline}
            {...inputConfig}
            value={props.value}
            onChange={props.changed}
            margin="normal"
            variant="outlined"
          />
        );
        break;
      default:
        inputElement = (
          <TextField
            className={classes.textFieldOutline}
            {...inputConfig}
            value={props.value}
            onChange={props.changed}
            margin="normal"
            variant="outlined"
          />
        );
    }
  } else {
    switch (props.elementType) {
      case "input":
        inputElement = (
          <TextField
            className={classes.textField}
            {...inputConfig}
            value={props.value}
            onChange={props.changed}
            margin="normal"
          />
        );
        break;
      default:
        inputElement = (
          <TextField
            className={classes.textField}
            {...inputConfig}
            value={props.value}
            onChange={props.changed}
            margin="normal"
          />
        );
    }
  }

  return <div className={classes.container}>{inputElement}</div>;
};

export default Input;
