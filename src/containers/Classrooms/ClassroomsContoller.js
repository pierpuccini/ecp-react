/* React imports */
import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
//Redux
import { connect } from "react-redux";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
/* App imports */
import PermisionError from "../../components/Errors/PermisionError/PermisionError";
import Loader from "../../components/UI/Loader/PngLoader/PngLoader";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";
import customClasses from './ClassroomsContoller.module.scss'

const createClassroom = asyncComponent(() => {
  return import("./Actions/CreateClassroom");
});

const useStyles = makeStyles(theme => ({
  container: {
    padding: "unset !important",
    [theme.breakpoints.up("md")]: {
      minWidth: "685px !important"
    }
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  },
  button: {
    [theme.breakpoints.down("xs")]: {
      minWidth: "200px",
      width: "100%"
    }
  },
  actionButtonsContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  classroomListHeader: {
    display: "flex",
    alignSelf: "center"
  },
  classroomListHeaderContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

const ClassroomController = props => {
  const classes = useStyles();

  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);
  const [navRoute, setNavRoute] = useState("classrooms");

  /* Use efect handles time out for loader */
  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 750);
    const parsedPath = props.location.pathname.replace("/", "").split("/");
    if (parsedPath.length > 1) {
      setNavRoute(`classrooms/${parsedPath[1]}`);
    }
    if(props.location.state) {
      setNavRoute(`${props.location.state.overwriteLocalNavState}`);
    }
    return () => {
      clearTimeout(showCoinLoader);
    };    
  }, [props.location]);

  const handleNavChange = (event, newValue) => {
    setNavRoute(newValue);
  };
  /* Define new routes in routes array with their url and corresponding component */
  let routes, redirect;
  const routesArray = [
    { url: "create", comp: createClassroom, restriction: "student" }
  ];

  /* Conditional routes section */
  redirect = <Redirect to={`/${navRoute}`} />;

  //Available routes or Guarded routes
  routes = (
    <Switch>
      {routesArray.map((route, index) => {
        if (route.restriction !== props.role) {
          return (
            <Route
              path={`/classrooms/${route.url}`}
              key={`/classrooms/${route.url}`}
              component={route.comp}
            />
          );
        } else {
          return <PermisionError key={index} />;
        }
      })}
    </Switch>
  );

  const classroomManager = (
    <React.Fragment>
      <Typography>Classroom Manager</Typography>
      <div className={classes.actionButtonsContainer}>
        <Button
          variant="contained"
          color="primary"
          className={customClasses.button}
          endIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={event => {
            handleNavChange(event, "classrooms/create");
          }}
        >
          Create Classroom
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={customClasses.button}
          endIcon={<EditOutlinedIcon />}
          onClick={event => {
            handleNavChange(event, "classrooms/edit");
          }}
        >
          Edit Classroom
        </Button>
      </div>
    </React.Fragment>
  );

  const classrooomController =
    props.location.pathname === "/classrooms" ? (
      <Container maxWidth="sm" className={classes.container}>
        {redirect}
        <Paper className={classes.paper}>
          {props.role === "student" ? null : classroomManager}
          <div className={classes.classroomListHeaderContainer}>
            <div className={classes.classroomListHeader}>
              <Icon style={{ marginRight: "5px" }}>
                <ListOutlinedIcon />
              </Icon>
              <Typography>Classroom List</Typography>
            </div>
            {props.role === "student" ? (
              <IconButton>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            ) : null}
          </div>
        </Paper>
      </Container>
    ) : (
      <React.Fragment>
        {redirect}
        {routes}
      </React.Fragment>
    );

  const loadingDom = (
    <div style={{ alignSelf: "center" }}>
      <Loader />
    </div>
  );

  return (
    <React.Fragment>
      {domReady ? classrooomController : loadingDom}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role
  };
};

export default withRouter(connect(mapStateToProps)(ClassroomController));
