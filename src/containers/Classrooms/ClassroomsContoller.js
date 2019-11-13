/* React imports */
import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
/* App imports */
import Loader from "../../components/Loader/PngLoader/PngLoader";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";

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
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      minWidth: "200px"
    },
    display: "flex",
    justifyContent: "space-between"
  },
  actionButtonsContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  classroomListHeader: {
    display: "flex"
  }
}));

const ClassroomController = props => {
  const classes = useStyles();

  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);
  const [navRoute, setNavRoute] = useState("classrooms");

  useEffect(() => {
    console.log("[classroom] Initial path", props.location.pathname);
    const parsedPath = props.location.pathname.replace("/", "").split("/");
    console.log("[classroom] parsedPath", parsedPath, parsedPath.length);
    if (parsedPath.length > 1) {
      console.log("[classroom] Redir to sublink", `/${parsedPath[1]}`);
      setNavRoute(`classrooms/${parsedPath[1]}`);
    }
    //eslint-disable-next-line
  }, []);

  /* Use efect handles time out for loader */

  useEffect(() => {
    let showCoinLoader = setTimeout(() => {
      setDomReady(true);
    }, 1500);
    return () => {
      clearTimeout(showCoinLoader);
    };
  }, []);

  const handleNavChange = (event, newValue) => {
    setNavRoute(newValue);
  };
  /* Define new routes in routes array with their url and corresponding component */
  let routes, redirect;
  const routesArray = [
    { url: "create", comp: createClassroom, restriction: "student" }
  ];

  /* Conditional routes section */
  console.log("[classroom] nav", `/${navRoute}`);
  redirect = <Redirect to={`/${navRoute}`} />;

  //Available routes or Guarded routes
  routes = (
    <Switch>
      {routesArray.map(route => {
        if (route.restriction !== props.role) {
          return (
            <Route
              path={`/classrooms/${route.url}`}
              key={`/classrooms/${route.url}`}
              component={route.comp}
            />
          );
        } else {
          return null;
        }
      })}
    </Switch>
  );

  const classrooomController =
    props.location.pathname === "/classrooms" ? (
      <Container maxWidth="sm" className={classes.container}>
        {redirect}
        <Paper className={classes.paper}>
          <Typography>Classroom Manager</Typography>
          <div className={classes.actionButtonsContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
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
              className={classes.button}
              endIcon={<EditOutlinedIcon />}
              onClick={event => {
                handleNavChange(event, "classrooms/edit");
              }}
            >
              Edit Classroom
            </Button>
          </div>
          <div>
            <div className={classes.classroomListHeader}>
              <Icon style={{ marginRight: "5px" }}>
                <ListOutlinedIcon />
              </Icon>
              <Typography>Classroom List</Typography>
            </div>
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
    <div style={{alignSelf: "center"}}>
      <Loader />
    </div>
  );

  return (
    <React.Fragment>
      {domReady ? classrooomController : loadingDom}
    </React.Fragment>
  );
};

export default withRouter(ClassroomController);
