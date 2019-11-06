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
      id: 1,
      sm: 12,
      xs: 12,
      permision: 'admin',
      customComp: <UserManagement loaded={showSkeleton}/>
    },
    {
      id: 2,
      sm: 6,
      xs: 12,
      content: "Send or Create Challenge!",
      onClickLink: "/",
      permision: 'student'
    },
    {
      id: 3,
      sm: 6,
      xs: 12,
      content: "Get Power Ups!",
      onClickLink: "/",
      permision: 'student-only'
    },
    {
      id: 4,
      sm: 6,
      xs: 12,
      content: "Power Up Manager",
      onClickLink: "/",
      permision: 'teacher'
    },
    {
      id: 5,
      sm: 6,
      xs: 6,
      content: "Active Challenges",
      onClickLink: "/",
      permision: 'student'
    },
    {
      id: 6,
      sm: false,
      xs: 6,
      content: 'Pending Challenges',
      onClickLink: "/",
      permision: 'student'
    },
    {
      id: 7,
      sm: 12,
      xs: 12,
      content: "Edit or Create Classroom!",
      onClickLink: "/",
      permision: 'teacher'
    },
    {
      id: 8,
      sm: false,
      xs: 6,
      content: 'Current Classrooms',
      onClickLink: "/",
      permision: 'student'
    },
    {
      id: 9,
      sm: false,
      xs: 6,
      content: 'Past Classrooms',
      onClickLink: "/",
      permision: 'student'
    },
    {
      id: 10,
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
