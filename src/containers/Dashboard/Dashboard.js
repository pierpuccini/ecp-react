//React Imports
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
//Redux
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
//App Imports
import HomeCards from "../../components/Dashboard/HomeCards/HomeCards";
import UserManagement from "../../components/Dashboard/UserManagement/UserManagement";
//Personal Helpers
// import { updateObject, checkValidity } from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: "0px 16px !important",
    overflow: "auto",
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  skeleton: {
    borderRadius: theme.spacing(2)
  }
}));

const Dashboard = props => {
  const classes = useStyles();
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let showSkeletonLoader = setTimeout(() => {
      setShowSkeleton(true);
    }, 750);
    return () => {
      clearTimeout(showSkeletonLoader);
    };
  }, []);

  const redirectDashboard = (event, redirectLink) => {
    props.history.push(redirectLink);
  };

  /* TODO: implement mini components for dashboard tiles */
  const dashboardItems = [
    {
      id: 1,
      sm: 12,
      xs: 12,
      permision: ["admin"],
      customComp: (
        <UserManagement
          loaded={showSkeleton}
          redirectDashboard={redirectDashboard}
        />
      )
    },
    {
      id: 2,
      sm: 6,
      xs: 12,
      content: "Send or Create Challenge!",
      onClickLink: "/home",
      permision: ["student", "teacher"]
    },
    {
      id: 3,
      sm: 6,
      xs: 12,
      content: "Get Power Ups!",
      onClickLink: "/power-ups/view",
      permision: ["student"]
    },
    {
      id: 4,
      sm: 6,
      xs: 12,
      content: "Power Up Manager",
      onClickLink: "/power-ups/manage",
      permision: ["teacher"]
    },
    {
      id: 5,
      sm: 6,
      xs: 6,
      content: "Active Challenges",
      onClickLink: "/home",
      permision: ["student", "teacher"]
    },
    {
      id: 6,
      sm: false,
      xs: 6,
      content: "Pending Challenges",
      onClickLink: "/home",
      permision: ["student", "teacher"]
    },
    {
      id: 7,
      sm: 12,
      xs: 12,
      content: "Create Classroom!",
      onClickLink: "/classrooms/create",
      permision: ["teacher"]
    },
    {
      id: 8,
      sm: false,
      xs: 6,
      content: "My Classrooms",
      onClickLink: "/classrooms",
      permision: ["student", "teacher", "admin"]
    },
    {
      id: 9,
      sm: false,
      xs: 6,
      content: "Past Classrooms",
      onClickLink: "/classrooms",
      permision: ["student", "teacher"]
    },
    {
      id: 10,
      sm: 12,
      xs: 12,
      content: "My Transactions",
      onClickLink: "/wallet",
      permision: ["student", "teacher"]
    },
    {
      id: 11,
      sm: false,
      xs: 6,
      content: "All Transactions",
      onClickLink: "/home",
      permision: ["admin"]
    }
  ];

  let availableItems = dashboardItems.map((item, index) => {
    if (item.permision.includes(props.role)) {
      return item
    }
    return null
  });

  return (
    <Container maxWidth="sm" className={classes.root}>
      <HomeCards
        dashboardCards={availableItems}
        loaded={showSkeleton}
        dashboardToRoute={redirectDashboard}
      />
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    profileLoaded: state.firebase.profile.isLoaded,
    role:
      state.firebase.profile.role === "super-admin"
        ? "admin"
        : state.firebase.profile.role
  };
};

export default withRouter(connect(mapStateToProps)(Dashboard));
