/* React Imports */
import React from "react";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: "unset !important",
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  skeleton: {
    borderRadius: theme.spacing(2)
  }
}));

const HomeCards = (props) => {
  const classes = useStyles();
  const { dashboardCards, loaded } = props;

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Grid container spacing={3}>
        {dashboardCards.map(card => {
          return (
            <Grid key={card.content} item sm={card.sm} xs={card.xs}>
              <Paper className={classes.paper}>
                {loaded ? (card.content) : (<Skeleton variant="rect" height={6} className={classes.skeleton}/>)}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default HomeCards;
