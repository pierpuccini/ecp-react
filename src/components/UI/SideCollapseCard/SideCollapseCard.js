/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
//Animations
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  }
}));

const SideCollapseCard = props => {
  const classes = useStyles();
  const { user, openCardHandler, openCard } = props;

  console.log("selectedUser", user);

  //checks if user is null
  if (!user) {
    return null;
  } else {
    return (
      <Grow in={openCard}>
        <Container maxWidth="sm">
          <Paper className={classes.paper}>
            <button onClick={openCardHandler}>
              Close card
            </button>
            <Typography>Editing user</Typography>
            {user.displayName}
          </Paper>
        </Container>
      </Grow>
    );
  }
};

export default SideCollapseCard;
