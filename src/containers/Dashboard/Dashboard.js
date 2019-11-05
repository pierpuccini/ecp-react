//React Imports
import React from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//App Imports
import HomeCards from '../../components/Dashboard/HomeCards'
// import classes from "./Dashboard.module.scss";
//MaterialUI Imports
// import { makeStyles } from "@material-ui/core/styles";
//Personal Helpers
// import { updateObject, checkValidity } from "../../shared/utility";

// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1)
//   }
// }));

const Dashboard = props => {
  // const matClasses = useStyles();

  const dashboardItems = [
    {
      sm: 6,
      xs: 12,
      content: "Send or Create Challenge!",
      onClickLink: "/"
    },
    {
      sm: 6,
      xs: 6,
      content: "Active challenges",
      onClickLink: "/"
    },
    {
      sm: false,
      xs: 6,
      content: 'Pending Challenges',
      onClickLink: "/"
    },
    {
      sm: false,
      xs: 6,
      content: 'Current Classrooms',
      onClickLink: "/"
    },
    {
      sm: false,
      xs: 6,
      content: 'Past Classrooms',
      onClickLink: "/"
    },
    {
      sm: 6,
      xs: 12,
      content: 'My Transactions',
      onClickLink: "/"
    },
  ];
  
  return (<HomeCards dashboardCards={dashboardItems} loaded={false}/>);
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(null,mapDispatchToProps)(Dashboard));
