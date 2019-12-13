/* React Imports */
import React, { useState } from "react";
import PropTypes from "prop-types";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
/* App Imports */

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
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
  desktopPaper: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={2} style={{ height: "100%" }}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

/* Semi smart component */
const ViewClassroom = props => {
  const classes = useStyles();
  const {
    updateClassroomForm,
    navActions,
    updateClassroomInfo,
    institutions,
    inputChangedHandler,
    buttonClickHandler,
    switchToggle,
    toggleSwitchHandler,
    toggleButtonChangedHandler,
    sliderChangedHandler,
    pendingStudents,
    activeStudents
  } = props;

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isTablet = useMediaQuery("(min-width: 959px)");
  //State in charge of tabs
  const [tabValue, settabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    settabValue(newValue);
  };

  //Creacts a valid field object
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

  const classroomFields = <p>info</p>;

  const roster = <p>roster</p>;

  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Info" />
        <Tab label="Roster" />
        <Tab label="Wallet" disabled />
      </Tabs>
      <TabPanel
        value={tabValue}
        index={0}
        style={{ height: "calc(100% - 5vh)" }}
      >
        {classroomFields}
      </TabPanel>
      <TabPanel
        value={tabValue}
        index={1}
        style={{ height: "calc(100% - 5vh)" }}
      >
        {roster}
      </TabPanel>
      <TabPanel
        value={tabValue}
        index={2}
        style={{ height: "calc(100% - 5vh)" }}
      >
        Item Three
      </TabPanel>
    </Paper>
  );
};

export default ViewClassroom;
