/* React imports */
import React, { useState } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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
  }
}));

const ClassroomListCard = props => {
  const classes = useStyles();
  const {
    classroom,
    role,
    classroomTeacher,
    classroomInstitution,
    prefersDarkMode,
    // pendingStudents,
    // activeStudents,
    studentStatus,
    isMobile
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMobileMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorEl(null);
  };

  let roleCaption = (
    <Typography
      variant="caption"
      className={classes.nameAndDetails}
      style={classroom.active_subject == null ? { color: "#777777" } : null}
    >
      {classroom.id}
    </Typography>
  );

  let statusStudent = (
    <Typography
      variant="caption"
      className={
        studentStatus === "pending"
          ? classes.studentStatusPending
          : classes.studentStatusActive
      }
      style={classroom.active_subject == null ? { color: "#777777" } : null}
    >
      {studentStatus === "pending"
        ? "Pending teacher approval"
        : "Active in classroom"}
    </Typography>
  );

  switch (role) {
    case "student":
      roleCaption = (
        <Typography
          variant="caption"
          className={classes.nameAndDetails}
          style={classroom.active_subject == null ? { color: "#777777" } : null}
        >
          {classroomTeacher.displayName}
        </Typography>
      );
      break;
    case "teacher":
      roleCaption = (
        <Typography
          variant="caption"
          className={classes.nameAndDetails}
          style={classroom.active_subject == null ? { color: "#777777" } : null}
        >
          {classroomInstitution.value}
        </Typography>
      );
      break;
    default:
      roleCaption = (
        <Typography
          variant="caption"
          className={classes.nameAndDetails}
          style={classroom.active_subject == null ? { color: "#777777" } : null}
        >
          {classroom.id}
        </Typography>
      );
      break;
  }

  const missingActivation = (
    <Typography
      variant="caption"
      className={classes.nameAndDetails}
      style={{ color: amber[600] }}
    >
      *Please activate classroom.
    </Typography>
  );

  //   let classroomViewer
  let mobileActions = (
    <IconButton
      onClick={handleMobileMenu}
      disabled={classroom.active_subject == null}
    >
      <VisibilityOutlinedIcon />
    </IconButton>
  );
  if (isMobile && role !== "student") {
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
            onClick={handleMobileMenuClose}
          >
            <IconButton color="primary" style={{ padding: "unset" }}>
              <EditOutlinedIcon />
            </IconButton>
          </MenuItem>
          <MenuItem
            className={classes.classroomCardActionsMenu}
            key="view"
            onClick={handleMobileMenuClose}
          >
            <IconButton style={{ padding: "unset" }}>
              <VisibilityOutlinedIcon />
            </IconButton>
          </MenuItem>
          <MenuItem
            className={classes.classroomCardActionsMenu}
            key="Delete"
            onClick={handleMobileMenuClose}
          >
            <IconButton
              className={classes.deleteButton}
              style={{ padding: "unset" }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </MenuItem>
        </Menu>
      </div>
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
          <Typography
            className={classes.nameAndDetails}
            style={
              classroom.active_subject == null ? { color: "#777777" } : null
            }
          >
            {classroom.subject_name}
          </Typography>
          {roleCaption}
          <Typography
            variant="caption"
            className={classes.nameAndDetails}
            style={
              classroom.active_subject == null ? { color: "#777777" } : null
            }
          >
            {classroom.subject_id}
          </Typography>
          {role === "student"
            ? statusStudent
            : role === "teacher" && classroom.active_subject == null
            ? missingActivation
            : null}
        </div>
      </div>
      {mobileActions}
    </Paper>
  );
};

export default ClassroomListCard;
