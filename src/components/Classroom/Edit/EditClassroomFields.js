/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Slider from "@material-ui/core/Slider";
//Icons
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined";

/* App Imports */
import Logo from "../../UI/Logo/Logo";
import CodeCopy from "../../UI/SpecialFields/CodeCopy";

const useStyles = makeStyles(theme => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%"
  },
  fieldsContainer: {
    width: "100%"
  },
  requieredFields: {
    margin: theme.spacing(2, 0)
  },
  institutionsField: {
    width: "-webkit-fill-available",
    margin: theme.spacing(0, 1)
  },
  codeAndNameContainer: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      justifyContent: "space-between"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column"
    }
  },
  classCodeContainer: {
    display: "flex",
    flexDirection: "column"
  },
  AdditionalInfoContainer: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "space-around"
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  MuiMenuList: {
    width: "auto !important"
  },
  switch: {
    display: "flex"
  },
  studentGroupContainer: {
    display: "flex",
    flexDirection: "column"
  },
  studentGroupContainerHeader: {
    display: "flex",
    marginBottom: theme.spacing(2)
  },
  switchFormLabel: {
    justifyContent: "space-between",
    display: "flex",
    width: "100%"
  },
  typographyAndIcon: {
    display: "flex"
  },
  slider: {
    padding: theme.spacing(1, 3)
  },
  sliderContainer: {
    margin: theme.spacing(2, 0)
  },
  coinInput: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(1)
  }
}));

const EditClassroomFields = props => {
  const classes = useStyles();

  const {
    updateClassroomForm,
    updateClassroomInfo,
    institutions,
    inputChangedHandler,
    toggleButtonChangedHandler,
    sliderChangedHandler
  } = props;

  const marks = [
    {
      value: 10,
      label: "10 min"
    },
    {
      value: 60,
      label: "60 min"
    }
  ];

  const children = [
    <ToggleButton key="1" value="1">
      <Typography>1</Typography>
    </ToggleButton>,
    <ToggleButton key="2" value="2">
      <Typography>2</Typography>
    </ToggleButton>,
    <ToggleButton key="3" value="3">
      <Typography>3</Typography>
    </ToggleButton>,
    <ToggleButton key="4" value="4">
      <Typography>4</Typography>
    </ToggleButton>
  ];

  return (
    <div className={classes.infoContainer}>
      <div className={classes.fieldsContainer}>
        <div className={classes.requieredFields}>
          <TextField
            className={classes.institutionsField}
            label="Institution"
            placeholder="Select Your Institution"
            type="text"
            margin="normal"
            variant="outlined"
            value={updateClassroomForm.client_id.value}
            onChange={event => inputChangedHandler(event, "client_id")}
            helperText={
              !updateClassroomForm.client_id.valid &&
              updateClassroomForm.client_id.touched
                ? "*Please Select you Institution"
                : "Select you Institution"
            }
            error={
              !updateClassroomForm.client_id.valid &&
              updateClassroomForm.client_id.touched
            }
            select
            required
          >
            {institutions.map(option => (
              <MenuItem
                className={classes.MuiMenuList}
                key={option.id}
                value={option.id}
              >
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <div className={classes.codeAndNameContainer}>
            <TextField
              className={classes.textField}
              style={{ width: "-webkit-fill-available" }}
              value={updateClassroomForm.subject_id.value}
              onChange={event => inputChangedHandler(event, "subject_id")}
              label="Class Code"
              placeholder="3752"
              type="number"
              margin="normal"
              helperText={
                !updateClassroomForm.subject_id.valid &&
                updateClassroomForm.subject_id.touched
                  ? "*Please Enter your internal classcode"
                  : "Enter your internal classcode"
              }
              error={
                !updateClassroomForm.subject_id.valid &&
                updateClassroomForm.subject_id.touched
              }
              variant="outlined"
              required
            />
            <TextField
              className={classes.textField}
              style={{ width: "-webkit-fill-available" }}
              value={updateClassroomForm.subject_name.value}
              onChange={event => inputChangedHandler(event, "subject_name")}
              label="Classroom Name"
              placeholder="Control"
              type="text"
              margin="normal"
              helperText={
                !updateClassroomForm.subject_name.valid &&
                updateClassroomForm.subject_name.touched
                  ? "*Please Enter your Classroom name"
                  : "Ex. Math, History etc..."
              }
              error={
                !updateClassroomForm.subject_name.valid &&
                updateClassroomForm.subject_name.touched
              }
              variant="outlined"
              required
            />
          </div>
        </div>
        <div className={classes.classCodeContainer}>
          <CodeCopy
            value={updateClassroomInfo.code_classroom}
            label="Class Code"
            helper="Share code with students"
          />
        </div>
        <Typography style={{ margin: "8px 16px 8px 0px" }}>
          Additional Classroom Info
        </Typography>
        <div className={classes.AdditionalInfoContainer}>
          <div className={classes.studentGroupContainer}>
            <div className={classes.studentGroupContainerHeader}>
              <PeopleAltOutlinedIcon
                style={{ alignSelf: "center", marginRight: "8px" }}
              />
              <Typography>Student Group Size</Typography>
            </div>
            <ToggleButtonGroup
              value={updateClassroomForm.group_size.value.toString()}
              onChange={(event, value) => {
                toggleButtonChangedHandler(event, value);
              }}
              style={{ alignSelf: "center" }}
              exclusive
            >
              {children}
            </ToggleButtonGroup>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.typographyAndIcon}>
              <TimerOutlinedIcon />
              <Typography
                style={{ alignSelf: "center", marginLeft: "16px" }}
                gutterBottom
              >
                Default Time Per Challenge
              </Typography>
            </div>
            <div className={classes.slider}>
              <Slider
                defaultValue={15}
                value={updateClassroomForm.challenge_duration.value}
                valueLabelDisplay="auto"
                onChange={(event, value) => {
                  sliderChangedHandler(event, value);
                }}
                step={5}
                marks={marks}
                min={10}
                max={60}
              />
            </div>
          </div>
          <div className={classes.coinInput}>
            <TextField
              className={classes.textField}
              label="Initial Coins"
              placeholder="5000"
              type="number"
              value={updateClassroomForm.initial_coins.value}
              onChange={event => {
                inputChangedHandler(event, "initial_coins");
              }}
              margin="normal"
              variant="outlined"
              required
              style={{ width: "190px" }}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <Logo height="56px" />
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClassroomFields;
