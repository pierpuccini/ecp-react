//React Imports
import React from "react";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//App Imports
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

  return (
    <div>
      Loged In
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
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default connect(null,mapDispatchToProps)(Dashboard);
