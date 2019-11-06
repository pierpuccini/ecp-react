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
  }
}));

const UserManagement = props => {
  const classes = useStyles();
  const { loaded } = props;

  return (
    <Paper className={classes.paper}>
      {loaded ? (
        <Typography>active students... active teachers...</Typography>
      ) : (
        <Skeleton variant="rect" height={6} className={classes.skeleton} />
      )}
    </Paper>
  );
};

export default UserManagement;
