/* Reacr Imports */
import React from "react";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
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
  const { activeStudents, handleToggle, checked } = props;

  return (
    <div className={classes.root}>
      <List component="div" className={classes.list}>
        {activeStudents.map(student => {
          return (
            <React.Fragment key={`fragment-${student.id}`}>
              <ListItem key={`list-${student.id}`}>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={student.name}
                  style={{ textTransform: "capitalize" }}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    color="primary"
                    onChange={handleToggle(student.id)}
                    checked={checked.indexOf(student.id) !== -1}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {activeStudents.length >= 1 ? null : <Divider key={`divider-${student.id}`} />}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};

export default ViewClassroomRoster;
