/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
//Animations
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    minWidth: "255px",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  }
}));

const SideCollapseCard = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { openCard, children } = props;

  return (
    <Grow in={openCard}>
      <Paper
        className={classes.paper}
        style={prefersDarkMode ? { border: "unset" } : null}
      >
        {children}
      </Paper>
    </Grow>
  );
};

export default SideCollapseCard;
