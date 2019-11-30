/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
//Animations
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  },
}));

const SideCollapseCard = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { user, openCardHandler, openCard } = props;

  console.log("selectedUser", user);

  //checks if user is null
  if (!user) {
    return null;
  } else {
    return (
      <Grow in={openCard}>
        <Paper className={classes.paper} style={(prefersDarkMode)?{border: "unset"}:null}>
          <button onClick={() => {openCardHandler('close')}}>Close card</button>
          <Typography>Editing user</Typography>
          {user.displayName}
        </Paper>
      </Grow>
    );
  }
};

export default SideCollapseCard;
