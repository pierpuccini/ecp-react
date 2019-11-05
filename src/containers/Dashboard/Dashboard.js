//React Imports
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//App Imports
import HomeCards from '../../components/Dashboard/HomeCards'
//Personal Helpers
// import { updateObject, checkValidity } from "../../shared/utility";

const Dashboard = props => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let showSkeletonLoader = setTimeout(() => {
      setShowSkeleton(true);
    }, 1500);
    return () => {
      clearTimeout(showSkeletonLoader);
    };
  }, [])

  /* TODO: implement mini components for dashboard tiles */
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

  return (<HomeCards dashboardCards={dashboardItems} loaded={showSkeleton}/>);
};

const mapStateToProps = state =>{
  return {
    profileLoaded: state.firebase.profile.isLoaded
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Dashboard));
