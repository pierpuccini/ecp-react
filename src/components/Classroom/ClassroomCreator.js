/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
import Logo from "../Logo/Logo";

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: "100%"
  },
  iconRoot: {
    textAlign: "center",
    marginRight: "8px",
    width: "18px",
    height: "18px",
    "font-size": "unset"
  },
  container: {
    display: "flex",
    flexDirection: "column"
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
      flexDirection: "column-reverse"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column-reverse"
    }
  },
  classroomContainer: {
    padding: "unset !important",
    [theme.breakpoints.up("md")]: {
      minWidth: "685px !important"
    }
  },
  autocompleteTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      minWidth: "150px"
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
  dense: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  inputFullName: {
    "text-transform": "capitalize"
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
  gLogin: {
    textTransform: "capitalize"
  },
  submitActions: {
    display: "flex",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center"
    },
    [theme.breakpoints.up("sm")]: {
      justifyContent: "space-between"
    }
  },
  loginError: {
    textAlign: "center",
    color: "#f44336",
    fontSize: "small"
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
  const { navActions, classroomsId, institutions, createClassroomForm } = props;

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
    <ToggleButton key={2} value="2">
      <Typography>2</Typography>
    </ToggleButton>,
    <ToggleButton key={3} value="3">
      <Typography>3</Typography>
    </ToggleButton>,
    <ToggleButton key={4} value="4">
      <Typography>4</Typography>
    </ToggleButton>,
    <ToggleButton key={5} value="5" disabled>
      <Typography>5</Typography>
    </ToggleButton>
  ];

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
              Chose or Create Classroom
            </Typography>
          </div>
          <div className={classes.codeAndNameContainer}>
            <TextField
              className={classes.textField}
              label="Institution"
              placeholder="Select Your Institution"
              type="text"
              margin="normal"
              variant="outlined"
              value={createClassroomForm.institutions.value}
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
            <Autocomplete
              className={classes.autocompleteTextField}
              value={createClassroomForm.classCode.value}
              freeSolo
              clearOnEscape
              disableOpenOnFocus
              autoHighlight
              options={classroomsId}
              getOptionLabel={option => option.toString()}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Class Code"
                  placeholder="3752"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
            <TextField
              className={classes.textField}
              label="Classroom Name"
              placeholder="Control"
              type="text"
              margin="normal"
              variant="outlined"
              required
            />
          </div>
          <Typography>Additional Classroom Info</Typography>
          <div className={classes.AdditionalInfoContainer}>
            <div className={classes.coinInput}>
              <TextField
                className={classes.textField}
                label="Initial Coins"
                placeholder="5000"
                type="number"
                margin="normal"
                variant="outlined"
                required
                style={{ width: "190px" }}
                InputProps={{
                  endAdornment: <Logo height="56px" />
                }}
              />
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
                  valueLabelDisplay="auto"
                  step={5}
                  marks={marks}
                  min={10}
                  max={60}
                />
              </div>
            </div>
            <div className={classes.switchContainer}>
              <div className={classes.switch}>
                <PeopleAltOutlinedIcon style={{ alignSelf: "center" }} />
                <FormControlLabel
                  className={classes.switchFormLabel}
                  control={<Switch value="checkedA" color="primary" />}
                  labelPlacement="start"
                  label="Student Groups"
                />
              </div>
              <Collapse
                in={true}
                style={{ justifyContent: "center", display: "flex" }}
              >
                <Typography gutterBottom>Group Size</Typography>
                <ToggleButtonGroup exclusive>{children}</ToggleButtonGroup>
              </Collapse>
            </div>
          </div>
          <div className={classes.formActions}>
            <div className={classes.negativeActions}>
              <Button
                variant="contained"
                className={classes.button}
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
