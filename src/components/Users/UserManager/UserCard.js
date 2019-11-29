/* React Imports */
import React, { useState } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
//Icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
//Animations
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  },
  userCard: {
    display: "flex",
    justifyContent: "space-between"
  },
  userActions: {
    display: "flex"
  },
  userNameAndRole: {
    textTransform: "capitalize"
  },
  nameAndRole: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center"
  },
  deleteButton: {
    color: theme.palette.error.dark
  },
  editUsersPanel: {
    margin: theme.spacing(2, 0)
  }
}));

const UserCard = props => {
  const classes = useStyles();
  const { user, isMobile } = props;

  const [editToggle, seteditToggle] = useState(false);

  let editToggleCopy;
  const userActionsHandler = action => {
    if (action === "edit") {
      editToggleCopy = editToggle;
      seteditToggle(!editToggleCopy);
    }
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.userCard}>
        <div className={classes.nameAndRole}>
          <Typography className={classes.userNameAndRole}>
            {user.displayName}
          </Typography>
          <Typography variant="caption" className={classes.userNameAndRole}>
            {user.role}
          </Typography>
        </div>
        <div className={classes.userActions}>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => {
              userActionsHandler("edit");
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton aria-label="inactivate">
            <PowerSettingsNewOutlinedIcon />
          </IconButton>
          <IconButton aria-label="delete" className={classes.deleteButton}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </div>
      </div>
      <Collapse in={editToggle && isMobile} timeout="auto">
        <div className={classes.editUsersPanel}>
          <Typography>Editing users</Typography>
        </div>
      </Collapse>
    </Paper>
  );
};

export default UserCard;
