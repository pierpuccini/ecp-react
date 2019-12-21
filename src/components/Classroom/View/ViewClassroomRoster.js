/* Reacr Imports */
import React from "react";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider/Divider";
//icons
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  list: {
      padding: "unset"
  }
}));

const ViewClassroomRoster = props => {
  const classes = useStyles();
  /* TODO: component missing various information tips */
  const { activeStudents } = props;
  return (
    <div className={classes.root}>
      <List component="div" className={classes.list}>
        {activeStudents.map(student => {
          return (
            <React.Fragment>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={student.name}
                  style={{ textTransform: "capitalize" }}
                />
              </ListItem>
              {activeStudents.length >= 1 ? null : <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};

export default ViewClassroomRoster;
