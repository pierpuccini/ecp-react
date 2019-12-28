/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import Collapse from "@material-ui/core/Collapse";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
//Icons
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
/* App Imports */
import Logo from "../../UI/Logo/Logo";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  requieredFields:{
    margin: theme.spacing(2,0)
  },
  institutionsField: {
    width: "-webkit-fill-available",
    margin: theme.spacing(0,1),
    marginTop: theme.spacing(2)
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
  AdditionalInfoContainer: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(0, 2),
      flexDirection: "column"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column"
    }
  },
  classroomContainer: {
    padding: "unset !important",
    overflow: "auto",
    [theme.breakpoints.up("md")]: {
      minWidth: "685px !important"
    }
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between"
  },
  positiveActions: {
    display: "flex",
    justifyContent: "space-between"
  },
  negativeActions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  },
  MuiMenuList: {
    width: "auto !important"
  },
  formHeader: {
    display: "flex"
  },
  switch: {
    display: "flex"
  },
  switchContainer: {
    display: "flex",
    flexDirection: "column"
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

const ClassroomCreator = props => {
  const classes = useStyles();
  const {
    navActions,
    institutions,
    createClassroomForm,
    inputChangedHandler,
    toggleButtonChangedHandler,
    sliderChangedHandler,
    buttonClickHandler,
    switchToggle,
    toggleSwitchHandler
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
    <ToggleButton key={1} value="1">
      <Typography>1</Typography>
    </ToggleButton>,
    <ToggleButton key={2} value="2">
      <Typography>2</Typography>
    </ToggleButton>,
    <ToggleButton key={3} value="3">
      <Typography>3</Typography>
    </ToggleButton>,
    <ToggleButton key={4} value="4">
      <Typography>4</Typography>
    </ToggleButton>
  ];

  //Creacts a valid field object
  let createClassroomFormArr = Object.keys(createClassroomForm).map(
    controlName => {
      return {
        controlName: controlName,
        data: createClassroomForm[controlName]
      };
    }
  );
  let validFields = createClassroomFormArr.map(item => {
    return {
      [item.controlName]: item.data.valid && item.data.touched
    };
  });
  validFields = Object.assign({}, ...validFields);

  return (
    <Container maxWidth="sm" className={classes.classroomContainer}>
      <Paper className={classes.paper}>
        <form>
          <div className={classes.formHeader}>
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
          <div className={classes.requieredFields}>
              <TextField
                className={classes.institutionsField}
                label="Institution"
                placeholder="Select Your Institution"
                type="text"
                margin="normal"
                variant="outlined"
                value={createClassroomForm.institutions.value}
                onChange={event => inputChangedHandler(event, "institutions")}
                helperText={
                  !createClassroomForm.institutions.valid &&
                  createClassroomForm.institutions.touched
                    ? "*Please Select you Institution"
                    : "Select you Institution"
                }
                error={
                  !createClassroomForm.institutions.valid &&
                  createClassroomForm.institutions.touched
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
                value={createClassroomForm.classCode.value}
                onChange={event => inputChangedHandler(event, "classCode")}
                label="Class Code"
                placeholder="3752"
                type="text"
                margin="normal"
                helperText={
                  !createClassroomForm.classCode.valid &&
                  createClassroomForm.classCode.touched
                    ? "*Please Enter your internal classcode"
                    : "Enter your internal classcode"
                }
                error={
                  !createClassroomForm.classCode.valid &&
                  createClassroomForm.classCode.touched
                }
                variant="outlined"
                required
              />
              <TextField
                className={classes.textField}
                value={createClassroomForm.className.value}
                onChange={event => inputChangedHandler(event, "className")}
                label="Classroom Name"
                placeholder="Control"
                type="text"
                margin="normal"
                helperText={
                  !createClassroomForm.className.valid &&
                  createClassroomForm.className.touched
                    ? "*Please Enter your Classroom name"
                    : "Ex. Math, History etc..."
                }
                error={
                  !createClassroomForm.className.valid &&
                  createClassroomForm.className.touched
                }
                variant="outlined"
                required
              />
            </div>
          </div>
          <Typography style={{margin: "0px 8px"}}>Additional Classroom Info</Typography>
          <div className={classes.AdditionalInfoContainer}>
            <div className={classes.switchContainer}>
              <div className={classes.switch}>
                <PeopleAltOutlinedIcon style={{ alignSelf: "center" }} />
                <FormControlLabel
                  className={classes.switchFormLabel}
                  control={
                    <Switch
                      value={switchToggle}
                      color="primary"
                      onChange={event => {
                        toggleSwitchHandler(event);
                      }}
                    />
                  }
                  labelPlacement="start"
                  label="Student Groups"
                />
              </div>
              <Collapse
                in={switchToggle}
                timeout="auto"
                style={{ justifyContent: "center", display: "flex" }}
              >
                <Typography gutterBottom>Group Size</Typography>
                <ToggleButtonGroup
                  value={createClassroomForm.studentGroups.value}
                  onChange={(event, value) => {
                    toggleButtonChangedHandler(event, value);
                  }}
                  exclusive
                >
                  {children}
                </ToggleButtonGroup>
              </Collapse>
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
                  value={createClassroomForm.challengeTime.value}
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
                value={createClassroomForm.coins.value}
                onChange={event => {
                  inputChangedHandler(event, "coins");
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
          <div className={classes.formActions}>
            <div className={classes.negativeActions}>
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
            </div>
            <div className={classes.positiveActions}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={
                  !validFields.institutions ||
                  !validFields.classCode ||
                  !validFields.className
                }
                onClick={() => {
                  buttonClickHandler("create");
                }}
                size="small"
              >
                Create Classroom
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default ClassroomCreator;
