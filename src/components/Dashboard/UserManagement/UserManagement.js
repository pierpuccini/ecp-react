/* React Imports */
import React from "react";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  skeleton: {
    borderRadius: theme.spacing(2)
  },
  skeletonType1: {
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(0)
  },
  usersContainer: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1)
  },
  title: {
    display: "flex",
    justifyContent: "flex-start"
  },
  typographySubs: {
    fontSize: "0.9rem"
  }
}));

const UserManagement = props => {
  const classes = useStyles();
  const { loaded } = props;
    // const loaded = false;
  return (
    <Paper className={classes.paper}>
      {loaded ? (
        <React.Fragment>
          <div className={classes.title}>
            <Typography>User Management</Typography>
          </div>
          <div className={classes.usersContainer}>
            <Typography className={classes.typographySubs}>
              Active Students
            </Typography>
            <Typography className={classes.typographySubs}>
              Active Teachers
            </Typography>
            <Typography className={classes.typographySubs}>
              Total Users
            </Typography>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Skeleton variant="rect" height={6} className={classes.skeleton} />
          <Skeleton height={37} className={classes.skeletonType1} />
        </React.Fragment>
      )}
    </Paper>
  );
};

export default UserManagement;
