/* Reacr Imports */
import React from "react";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider/Divider";
import Collapse from "@material-ui/core/Collapse/Collapse";
import TextField from "@material-ui/core/TextField/TextField";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Button from "@material-ui/core/Button/Button";
//icons
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
/* App imports */
import ExpandableItem from "../../UI/List/ExpandableItem";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
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
  },
  deleteGroup: {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
    padding: "6px"
  },
  deleteGroupContainer: {
    paddingLeft: "26px"
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
    studentGroupsField,
    inputChangedHandler,
    studentGroupActions,
    studentsGroupsArray,
    myId
  } = props;

  const listSubheader =
    groupSize > 1 ? (
      <ListSubheader component="div" id="nested-list-subheader">
        <Typography className={classes.groupSizeWarning} variant="caption">
          *Please create groups of {groupSize}
        </Typography>
      </ListSubheader>
    ) : null;

    
    const studentGroupsComponent = studentsGroupsArray.map(groupInfo => {
      let found = groupInfo.students_id.find(student => student.id === myId);
        const deleteGroup = (
          <div className={classes.deleteGroupContainer}>
            <Button
              variant="contained"
              className={classes.deleteGroup}
              onClick={event => {
                studentGroupActions(event, "delete", groupInfo.id);
              }}
            >
              <DeleteOutlineOutlinedIcon />
              Delete Group
            </Button>
          </div>
        );
    return (
      <ExpandableItem
        key={groupInfo.id}
        icons={[<GroupOutlinedIcon />, <AccountCircleOutlinedIcon />]}
        text={groupInfo.group_name}
        list={groupInfo.students_id}
        comp={found != null ? deleteGroup : null}
      />
    );
  });

  const activeStudentsComponent = activeStudents.map(student => {
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
  });

  return (
    <div className={classes.root}>
      <List component="div" className={classes.list} subheader={listSubheader}>
        {studentGroupsComponent}
        {activeStudentsComponent}
        <Collapse in={checked.length > 0 && checked.length <= groupSize}>
          {groupLimitReached ? (
            <Typography className={classes.limitReached} variant="caption">
              *Group size Max. {groupSize}
            </Typography>
          ) : null}
          <div className={classes.collapseContainer}>
            <TextField
              className={classes.textField}
              value={studentGroupsField.groupName.value}
              onChange={event => inputChangedHandler(event, "groupName")}
              label="Group Name"
              placeholder="The winners"
              type="text"
              margin="normal"
              helperText={
                !studentGroupsField.groupName.valid &&
                studentGroupsField.groupName.touched
                  ? "*Please Enter your Group name"
                  : null
              }
              error={
                !studentGroupsField.groupName.valid &&
                studentGroupsField.groupName.touched
              }
              variant="outlined"
              required
            />
            <span className={classes.iconButton}>
              <IconButton
                className={classes.save}
                onClick={event => {
                  studentGroupActions(event, "save");
                }}
              >
                <CheckOutlinedIcon />
              </IconButton>
            </span>
            <span className={classes.iconButton}>
              <IconButton
                className={classes.cancel}
                onClick={event => {
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
