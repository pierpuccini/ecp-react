/* Reacr Imports */
import React from "react";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider/Divider";
import Collapse from "@material-ui/core/Collapse/Collapse";
import TextField from "@material-ui/core/TextField/TextField";
import IconButton from "@material-ui/core/IconButton/IconButton";
//icons
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  list: {
    padding: "unset"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  groupSizeWarning: {
    color: amber[700]
  },
  limitReached: {
    color: theme.palette.error.main
  },
  collapseContainer: {
    display: "flex"
  },
  iconButton: {
    alignSelf: "center"
  },
  save: {
    color: green[600]
  },
  cancel: {
    color: theme.palette.error.main
  }
}));

const ViewClassroomRoster = props => {
  const classes = useStyles();
  /* TODO: component missing various information tips */
  const {
    activeStudents,
    handleToggle,
    checked,
    groupSize,
    groupLimitReached,
    studentGroups,
    inputChangedHandler,
    studentGroupActions
  } = props;

  return (
    <div className={classes.root}>
      {groupSize > 1 ? (
        <Typography className={classes.groupSizeWarning} variant="caption">
          *Please create groups of {groupSize}
        </Typography>
      ) : null}
      <List component="div" className={classes.list}>
        {activeStudents.map(student => {
          return (
            <React.Fragment key={`fragment-${student.id}`}>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={student.name}
                  style={{ textTransform: "capitalize" }}
                />
                {groupSize > 1 ? (
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      color="primary"
                      onChange={handleToggle(student.id)}
                      checked={checked.indexOf(student.id) !== -1}
                    />
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
              {activeStudents.length >= 1 ? null : <Divider />}
            </React.Fragment>
          );
        })}
        <Collapse in={checked.length > 0 && checked.length <= groupSize}>
          {groupLimitReached ? (
            <Typography className={classes.limitReached} variant="caption">
              *Group size Max. {groupSize}
            </Typography>
          ) : null}
          <div className={classes.collapseContainer}>
            <TextField
              className={classes.textField}
              value={studentGroups.groupName.value}
              onChange={event => inputChangedHandler(event, "groupName")}
              label="Group Name"
              placeholder="The winners"
              type="text"
              margin="normal"
              helperText={
                !studentGroups.groupName.valid &&
                studentGroups.groupName.touched
                  ? "*Please Enter your Group name"
                  : null
              }
              error={
                !studentGroups.groupName.valid &&
                studentGroups.groupName.touched
              }
              variant="outlined"
              required
            />
            <span className={classes.iconButton}>
              <IconButton
                className={classes.save}
                onClick={(event) => {
                  studentGroupActions(event, "save");
                }}
              >
                <CheckOutlinedIcon />
              </IconButton>
            </span>
            <span className={classes.iconButton}>
              <IconButton
                className={classes.cancel}
                onClick={(event) => {
                  studentGroupActions(event, "cancel");
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </span>
          </div>
        </Collapse>
      </List>
    </div>
  );
};

export default ViewClassroomRoster;
