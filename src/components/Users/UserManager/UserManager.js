/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
// import MenuItem from "@material-ui/core/MenuItem";
// import Button from "@material-ui/core/Button";
// import Icon from "@material-ui/core/Icon";
// import IconButton from "@material-ui/core/IconButton";
// import InputAdornment from "@material-ui/core/InputAdornment";
//Animations
// import Collapse from "@material-ui/core/Collapse";
//Icons
// import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
// import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
// import DoneOutlineOutlinedIcon from "@material-ui/icons/DoneOutlineOutlined";
// import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
//App Imports
// import gIcon from "../../../assets/svg/search.svg";

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

const UserManager = props => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.myAccountContainer}>
      <Paper className={classes.paper}>
        <form onSubmit={props.submitHandler}>
          <Typography>My Account</Typography>
          <div className={classes.container}>
            <TextField
              className={classes.textField}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              value
              onChange={event =>
                props.inputChangedHandler(event, "displayName")
              }
              margin="normal"
              variant="outlined"
            />
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default UserManager