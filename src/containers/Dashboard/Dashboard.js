//React Imports
import React from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//App Imports
import loader from "../../assets/loaders/educoin(B).gif";
// import classes from "./Dashboard.module.scss";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
//Personal Helpers
// import { updateObject, checkValidity } from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const Dashboard = props => {
  const matClasses = useStyles();

  let phoneLogin = false;
  if (props.location.search.includes("login-method=phone")) {
    phoneLogin = true;
    setTimeout(() => {
      props.history.replace('/home')
      phoneLogin = false;
      document.getElementById("root").click();
    }, 1500);
  }

  const loadingGIF = (
    <div className="App">
      <img src={loader} alt="loading..." />
    </div>
  );
  
  const dashboard = (
    <div>
      <p>Loged In</p>
      <Button
        className={matClasses.button}
        variant="contained"
        color="primary"
        onClick={() => props.logout()}
      >
        Log Out
      </Button>
    </div>
  );

  return (
    <div>
      {phoneLogin ? loadingGIF : dashboard}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(null,mapDispatchToProps)(Dashboard));
