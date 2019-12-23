/* React imports */
import React, { useState, useEffect } from "react";
/* Material imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
//Icons
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
/* App Imports */
import EditClassroomFields from "./Edit/EditClassroomFields";
import EditClassroomRoster from "./Edit/EditClassroomRoster";
import ViewClassroomInfo from "./View/ViewClassroomInfo";
import ViewClassroomRoster from "./View/ViewClassroomRoster";

const useStyles = makeStyles(theme => ({
  paper: {
    overflow: "auto",
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  },
  formSubheader: {
    display: "flex",
    margin: theme.spacing(1)
  },
  root: {
    width: "100%"
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20
  },
  expandableContentCards: {
    boxShadow: "unset",
    border: "2px solid #0000003b",
    height: "100%",
    borderRadius: "16px !important",
    margin: theme.spacing(1)
  },
  details: {
    alignItems: "center"
  },
  expandableActions: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-between"
    }
  },
  button: {
    margin: theme.spacing(0, 1)
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
}));

const DetailedClassroomView = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isTablet = useMediaQuery("(min-width: 959px)");

  const {
    navActions,
    edit,
    view,
    updateClassroomForm,
    updateClassroomInfo,
    institutions,
    inputChangedHandler,
    studentGroupsChangedHandler,
    deleteStudentGroup,
    buttonClickHandler,
    switchToggle,
    toggleSwitchHandler,
    toggleButtonChangedHandler,
    sliderChangedHandler,
    pending_students,
    active_students,
    viewInfo,
    teacher,
    studentGroupsField,
    studentsGroupsArray,
    myId,
    role
  } = props;

  const [pendingStudents, setpendingStudents] = useState([...pending_students]);
  const [activeStudents, setactiveStudents] = useState([...active_students]);
  const [deletedStudents, setdeletedStudents] = useState([]);
  /* Checks the users in order to create groups */
  const [checked, setChecked] = useState([]);
  /* Sets error when students pass the gruop limit */
  const [groupLimitReached, setgroupLimitReached] = useState(false);

  useEffect(() => {
    if (pending_students.length > 0) {
      setpendingStudents([...pending_students]);
    }
    if (active_students.length > 0) {
      setactiveStudents([...active_students]);
    }
  }, [pending_students, active_students]);

  /* Creacts a valid field object */
  let updateClassroomFormArr = Object.keys(updateClassroomForm).map(
    controlName => {
      return {
        controlName: controlName,
        data: updateClassroomForm[controlName]
      };
    }
  );
  let validFields = updateClassroomFormArr.map(item => {
    return {
      [item.controlName]: item.data.valid && item.data.touched
    };
  });
  validFields = Object.assign({}, ...validFields);

  const actionsPicker = type => {
    switch (type) {
      case "info":
        return (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={
              !validFields.client_id ||
              !validFields.subject_id ||
              !validFields.subject_name ||
              !validFields.group_size ||
              !validFields.challenge_duration ||
              !validFields.initial_coins
            }
            onClick={() => {
              buttonClickHandler("activate");
            }}
            size="small"
          >
            save
          </Button>
        );
      case "roster":
        return (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              buttonClickHandler("save", {
                pending_students: pendingStudents,
                active_students: activeStudents,
                deleted_students: deletedStudents
              });
            }}
            size="small"
          >
            save
          </Button>
        );
      default:
        break;
    }
  };

  /* Handles the checkbox in order to push and create student groups */
  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    let newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    if (newChecked.length > viewInfo.group_size) {
      newChecked = [...checked];
      setgroupLimitReached(true);
    } else {
      setgroupLimitReached(false);
    }
    setChecked(newChecked);
  };

  /* Filters students in groups from active students array */
  const filteredActiveStudents = (active, groups) => {
    let groupsId = [];
    groups.forEach(groupInfo => {
      groupsId = groupInfo.students_id.map(student => student.id);
    });

    return active.filter(student => !groupsId.includes(student.id));
  };

  const studentGroupActions = (event, type, id) => {
    if (type === "cancel") {
      setChecked([]);
    } else if (type === "save") {
      studentGroupsChangedHandler(event, "studentArray", checked);
    } else if (type === "delete") {
      deleteStudentGroup(id);
    }
  };

  let info, roster, studentGroups;
  /* This condition handles the info, roster and wallet for edit and view as well as save actions for edit */
  if (edit) {
    info = (
      <EditClassroomFields
        navActions={navActions}
        updateClassroomInfo={updateClassroomInfo}
        updateClassroomForm={updateClassroomForm}
        institutions={institutions}
        inputChangedHandler={inputChangedHandler}
        buttonClickHandler={buttonClickHandler}
        validFields={validFields}
        isTablet={isTablet}
        switchToggle={switchToggle}
        toggleSwitchHandler={toggleSwitchHandler}
        toggleButtonChangedHandler={toggleButtonChangedHandler}
        sliderChangedHandler={sliderChangedHandler}
      />
    );
    roster = (
      <EditClassroomRoster
        pending_students={pendingStudents}
        active_students={activeStudents}
        buttonClickHandler={buttonClickHandler}
        pendingStudents={pendingStudents}
        setpendingStudents={setpendingStudents}
        activeStudents={activeStudents}
        setactiveStudents={setactiveStudents}
        deletedStudents={deletedStudents}
        setdeletedStudents={setdeletedStudents}
      />
    );
    studentGroups = (
      <ViewClassroomRoster
        activeStudents={filteredActiveStudents(
          activeStudents,
          studentsGroupsArray
        )}
        checked={checked}
        handleToggle={handleToggle}
        groupSize={viewInfo.group_size}
        groupLimitReached={groupLimitReached}
        studentGroupsField={studentGroupsField}
        inputChangedHandler={studentGroupsChangedHandler}
        studentGroupActions={studentGroupActions}
        studentsGroupsArray={studentsGroupsArray}
        myId={myId}
        role={role}
      />
    );
  } else if (view) {
    info = (
      <ViewClassroomInfo
        navActions={navActions}
        info={viewInfo}
        isTablet={isTablet}
        institutions={institutions}
        teacher={teacher}
      />
    );
    roster = (
      <ViewClassroomRoster
        activeStudents={filteredActiveStudents(
          activeStudents,
          studentsGroupsArray
        )}
        checked={checked}
        handleToggle={handleToggle}
        groupSize={viewInfo.group_size}
        groupLimitReached={groupLimitReached}
        studentGroupsField={studentGroupsField}
        inputChangedHandler={studentGroupsChangedHandler}
        studentGroupActions={studentGroupActions}
        studentsGroupsArray={studentsGroupsArray}
        myId={myId}
        role={role}
      />
    );
  }

  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <div className={classes.formSubheader}>
        <IconButton
          size="small"
          style={{ marginRight: "5px" }}
          onClick={() => {
            navActions();
          }}
        >
          <ArrowBackIosOutlinedIcon />
        </IconButton>
        <Typography style={{ alignSelf: "center" }}>
          Return to classroom List
        </Typography>
      </div>
      <div className={classes.root}>
        <ExpansionPanel
          defaultExpanded
          className={classes.expandableContentCards}
          TransitionProps={{ unmountOnExit: true }}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="body1">Classroom info</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            {info}
          </ExpansionPanelDetails>
          {edit ? (
            <React.Fragment>
              <Divider />
              <ExpansionPanelActions className={classes.expandableActions}>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={() => {
                    buttonClickHandler("cancel");
                  }}
                  size="small"
                  style={{ backgroundColor: "#f44336", color: "#ffffff" }}
                >
                  Cancel
                </Button>
                {actionsPicker("info")}
              </ExpansionPanelActions>
            </React.Fragment>
          ) : null}
        </ExpansionPanel>
        <ExpansionPanel
          defaultExpanded={isTablet}
          className={classes.expandableContentCards}
          TransitionProps={{ unmountOnExit: true }}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="body1">Classroom roster</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            {roster}
          </ExpansionPanelDetails>
          {edit ? (
            <React.Fragment>
              <Divider />
              <ExpansionPanelActions className={classes.expandableActions}>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={() => {
                    buttonClickHandler("cancel");
                  }}
                  size="small"
                  style={{ backgroundColor: "#f44336", color: "#ffffff" }}
                >
                  Cancel
                </Button>
                {actionsPicker("roster")}
              </ExpansionPanelActions>
            </React.Fragment>
          ) : null}
        </ExpansionPanel>
        {role === "teacher" ? (
          <ExpansionPanel
            defaultExpanded={isTablet}
            className={classes.expandableContentCards}
            TransitionProps={{ unmountOnExit: true }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography variant="body1">Classroom student groups</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {studentGroups}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ) : null}
        <ExpansionPanel
          className={classes.expandableContentCards}
          TransitionProps={{ unmountOnExit: true }}
          disabled
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="body1">Wallet</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Typography variant="caption">
              Select your destination of choice
              <br />
              <a href="#secondary-heading-and-columns" className={classes.link}>
                Learn more
              </a>
            </Typography>
          </ExpansionPanelDetails>
          {edit ? (
            <React.Fragment>
              <Divider />
              <ExpansionPanelActions className={classes.expandableActions}>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={() => {
                    buttonClickHandler("cancel");
                  }}
                  size="small"
                  style={{ backgroundColor: "#f44336", color: "#ffffff" }}
                >
                  Cancel
                </Button>
                {actionsPicker("")}
              </ExpansionPanelActions>
            </React.Fragment>
          ) : null}
        </ExpansionPanel>
      </div>
    </Paper>
  );
};

export default DetailedClassroomView;
