//React Imports
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import { Route, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
//App Imports
import HomeCards from '../../components/Dashboard/HomeCards/HomeCards'
import UserManagement from '../../components/Dashboard/UserManagement/UserManagement'
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
      sm: 12,
      xs: 12,
      content: "User Management",
      onClickLink: "/",
      permision: 'admin',
      customComp: <UserManagement loaded={showSkeleton}/>
    },
    {
      sm: 6,
      xs: 12,
      content: "Send or Create Challenge!",
      onClickLink: "/",
      permision: 'student'
    },
    {
      sm: 6,
      xs: 12,
      content: "Get Power Ups!",
      onClickLink: "/",
      permision: 'student-only'
    },
    {
      sm: 6,
      xs: 12,
      content: "Power Up Manager",
      onClickLink: "/",
      permision: 'teacher'
    },
    {
      sm: 6,
      xs: 6,
      content: "Active challenges",
      onClickLink: "/",
      permision: 'student'
    },
    {
      sm: false,
      xs: 6,
      content: 'Pending Challenges',
      onClickLink: "/",
      permision: 'student'
    },
    {
      sm: 12,
      xs: 12,
      content: "Edit or Create Classroom!",
      onClickLink: "/",
      permision: 'teacher'
    },
    {
      sm: false,
      xs: 6,
      content: 'Current Classrooms',
      onClickLink: "/",
      permision: 'student'
    },
    {
      sm: false,
      xs: 6,
      content: 'Past Classrooms',
      onClickLink: "/",
      permision: 'student'
    },
    {
      sm: 12,
      xs: 12,
      content: 'My Transactions',
      onClickLink: "/",
      permision: 'student'
    },
  ];

  dashboardItems.forEach((item, index) => {
    if (props.role === "student" && item.permision === "teacher") {
      dashboardItems.splice(index, 1);
    } else if (props.role !== "student" && item.permision === "student-only") {
      dashboardItems.splice(index, 1);
    } else if(props.role !== 'admin' && item.permision === 'admin'){
      dashboardItems.splice(index, 1);
    }
  });

  return (<HomeCards dashboardCards={dashboardItems} loaded={showSkeleton}/>);
};

const mapStateToProps = state =>{
  return {
    profileLoaded: state.firebase.profile.isLoaded,
    role: state.firebase.profile.role
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Dashboard));
