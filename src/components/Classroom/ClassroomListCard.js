/* React imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
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
    pendingStudents,
    activeStudents,
    studentStatus
  } = props;

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
          {role === "student" ? statusStudent : null}
        </div>
      </div>
    </Paper>
  );
};

export default ClassroomListCard;
