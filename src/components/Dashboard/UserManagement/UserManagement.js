/* React Imports */
import React from "react";
/* Redux Imports */
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
//icons
import RedoOutlinedIcon from "@material-ui/icons/RedoOutlined";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  skeleton: {
    borderRadius: theme.spacing(2)
  },
  skeletonType1: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(0)
    }
  },
  usersContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      justifyContent: "space-between",
      paddingTop: theme.spacing(1)
    }
  },
  title: {
    display: "flex",
    justifyContent: "space-between"
  },
  typographySubs: {
    fontSize: "0.9rem"
  },
  button: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex"
    }
  },
  iconButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    },
    [theme.breakpoints.down("sm")]: {
      padding: "unset"
    }
  }
}));

const UserManagement = props => {
  const classes = useStyles();
  const { loaded, redirectDashboard } = props;
  /* Loads teachers and studets data from Firestore */
  useFirestoreConnect(() => [
    {
      collection: "users",
      storeAs: "students",
      where: ["role", "==", "student"]
    },
    {
      collection: "users",
      storeAs: "teachers",
      where: ["role", "==", "teacher"]
    }
  ]);
  const students = useSelector(
    ({ firestore: { ordered } }) => ordered.students
  );
  const teachers = useSelector(
    ({ firestore: { ordered } }) => ordered.teachers
  );

  return (
    <Paper className={classes.paper}>
      {loaded && isLoaded(teachers) ? (
        <React.Fragment>
          <div className={classes.title}>
            <Typography>User Management</Typography>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              endIcon={<RedoOutlinedIcon />}
              onClick={event => {
                redirectDashboard(event, "/user-manager");
              }}
            >
              Manage Users
            </Button>
            <IconButton
              className={classes.iconButton}
              onClick={event => {
                redirectDashboard(event, "/user-manager");
              }}
            >
              <RedoOutlinedIcon />
            </IconButton>
          </div>
          <div className={classes.usersContainer}>
            <Typography className={classes.typographySubs}>
              Active Students: {students.length}
            </Typography>
            <Typography className={classes.typographySubs}>
              Active Teachers: {teachers.length}
            </Typography>
            <Typography className={classes.typographySubs}>
              Total Users: {students.length + teachers.length}
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
