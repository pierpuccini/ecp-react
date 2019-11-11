/* React imports */
import React, { useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
/* App imports */
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";

const createClassroom = asyncComponent(() => {
  return import("./Actions/CreateClassroom");
});

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const ClassroomController = props => {
  const classes = useStyles();
  const [navRoute, setNavRoute] = useState("/classrooms");
  /* Define new routes in routes array with their url and corresponding component */
  let routes;
  const routesArray = [
    { url: "create", comp: createClassroom, restriction: "student" }
  ];

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

  return (
    <React.Fragment>
      {props.location.pathname === "/classrooms" ? (
        <Container maxWidth="sm" className={classes.container}>
          <Paper className={classes.paper}>
            <Typography>Classroom Manager</Typography>
            <div>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<AddCircleOutlineOutlinedIcon />}
              >
                Create Classroom
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<EditOutlinedIcon />}
              >
                Edit Classroom
              </Button>
            </div>
            <p>list of classrooms</p>
          </Paper>
        </Container>
      ) : (
        routes
      )}
    </React.Fragment>
  );
};

export default withRouter(ClassroomController);
