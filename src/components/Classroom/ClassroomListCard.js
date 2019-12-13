/* React imports */
import React, { useState } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
//icons
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    justifyContent: "space-between",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  },
  classroomListHeaderContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  classroomCard: {
    display: "flex",
    justifyContent: "space-between"
  },
  classroomCardActions: {
    display: "flex",
    alignSelf: "center"
  },
  classroomCardActionsMenu: {
    display: "flex",
    justifyContent: "space-between"
  },
  classroomNameAndDetails: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center"
  },
  nameAndDetails: {
    textTransform: "capitalize"
  },
  studentStatusActive: {
    textTransform: "capitalize",
    color: green[700]
  },
  studentStatusPending: {
    textTransform: "capitalize",
    color: amber[600]
  },
  deleteButton: {
    color: theme.palette.error.dark
  },
  button: {
    margin: theme.spacing(3, 1),
    backgroundColor: green[700]
  }
}));

const ClassroomListCard = props => {
  const classes = useStyles();
  const {
    classroom,
    role,
    activeClassroom,
    classroomTeacher,
    classroomInstitution,
    prefersDarkMode,
    isMobile,
    handleNavChange,
    handleDelete,
    handleRestore
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMobileMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorEl(null);
  };

  const classroomName = (
    <Typography
      className={classes.nameAndDetails}
      style={
        !activeClassroom || classroom.deleted ? { color: "#777777" } : null
      }
    >
      {classroom.subject_name}
    </Typography>
  );

  let roleCaption;
  /* Caption switcher */
  switch (role) {
    case "student":
      roleCaption = (
        <React.Fragment>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            {classroomTeacher.displayName}
          </Typography>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            Classroom ID: {classroom.subject_id}
          </Typography>
        </React.Fragment>
      );
      break;
    case "teacher":
      roleCaption = (
        <React.Fragment>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            {classroomInstitution.value}
          </Typography>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            Classroom ID: {classroom.subject_id}
          </Typography>
        </React.Fragment>
      );
      break;
    default:
      roleCaption = (
        <React.Fragment>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            Institution: {classroomInstitution.value}
          </Typography>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            Teacher: {classroomTeacher.displayName}
          </Typography>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            Classroom ID: {classroom.subject_id}
          </Typography>
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              !activeClassroom || classroom.deleted
                ? { color: "#777777" }
                : null
            }
          >
            Database ID: {classroom.id}
          </Typography>
        </React.Fragment>
      );
      break;
  }

  let statusStudent = (
    <Typography
      variant="caption"
      className={
        !activeClassroom
          ? classes.studentStatusPending
          : classes.studentStatusActive
      }
    >
      {!activeClassroom ? "Pending teacher approval" : "Active in classroom"}
    </Typography>
  );

  const missingActivation = (
    <Typography
      variant="caption"
      className={classes.nameAndDetails}
      style={{ color: amber[600] }}
    >
      *Please activate classroom.
    </Typography>
  );

  const active = (
    <Typography
      variant="caption"
      className={classes.nameAndDetails}
      style={{ color: green[700] }}
    >
      *Active Classroom.
    </Typography>
  );

  /* Sets status for all users */
  let cardStatus;
  switch (role) {
    case "student":
      cardStatus = statusStudent;

      break;
    case "teacher":
      if (!activeClassroom) {
        cardStatus = missingActivation;
      } else {
        cardStatus = active;
      }
      break;
    default:
      if (!activeClassroom) {
        cardStatus = missingActivation;
      } else {
        cardStatus = active;
      }
      break;
  }

  //   let classroomViewer
  let mobileActions = (
    <span style={{alignSelf: "center"}}>
      <IconButton
        onClick={event =>
          handleNavChange(event, `classrooms/view/:${classroom.id}`)
        }
        disabled={!activeClassroom}
      >
        <VisibilityOutlinedIcon />
      </IconButton>
    </span>
  );
  if (isMobile && role === "teacher") {
    mobileActions = (
      <div className={classes.classroomCardActions}>
        <IconButton onClick={handleMobileMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleMobileMenuClose}
        >
          <MenuItem
            className={classes.classroomCardActionsMenu}
            key="edit"
            onClick={event =>
              handleNavChange(event, `classrooms/edit/:${classroom.id}`)
            }
          >
            <EditOutlinedIcon color="primary" />
          </MenuItem>
          <MenuItem
            className={classes.classroomCardActionsMenu}
            key="Delete"
            onClick={() => {
              handleDelete(classroom.id);
            }}
          >
            <DeleteOutlineOutlinedIcon className={classes.deleteButton} />
          </MenuItem>
        </Menu>
      </div>
    );
  } else if (role === "teacher") {
    mobileActions = (
      <div className={classes.classroomCardActions}>
        <IconButton
          color="primary"
          onClick={event =>
            handleNavChange(event, `classrooms/edit/:${classroom.id}`)
          }
        >
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          className={classes.deleteButton}
          onClick={() => {
            handleDelete(classroom.id);
          }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </div>
    );
  }
  // only for admins, they will be the only ones able to restore a classroom
  if (classroom.deleted) {
    mobileActions = (
      <Button
        size="small"
        variant="contained"
        className={classes.button}
        onClick={() => {
          handleRestore(classroom.id);
        }}
      >
        Restore
      </Button>
    );
  }

  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
      key={classroom.code_classroom}
    >
      <div className={classes.classroomCard}>
        <div className={classes.classroomNameAndDetails}>
          {classroomName}
          {roleCaption}
          {cardStatus}
        </div>
      </div>
      {mobileActions}
    </Paper>
  );
};

export default ClassroomListCard;
