/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from '@material-ui/core/Button';
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined";
//Icons
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
      flexWrap: "wrap"
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
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column-reverse"
    }
  },
  positiveActions:{
    display: "flex",
    justifyContent: "space-between"
  },
  negativeActions:{
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
  switchFormLabel: {
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
      display: "flex",
      width: "100%"
    }
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
    justifyContent: "center"
  }
}));

const ClassroomCreator = props => {
  const classes = useStyles();
  const { navActions } = props;

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
              placeholder="Universidad del Norte"
              type="text"
              margin="normal"
              variant="outlined"
              required
            />
            <Autocomplete
              className={classes.autocompleteTextField}
              freeSolo
              clearOnEscape
              disableOpenOnFocus
              autoHighlight
              options={top100Films.map(option => option.title)}
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
            <div className={classes.switch}>
              <PeopleAltOutlinedIcon style={{ alignSelf: "center" }} />
              <FormControlLabel
                className={classes.switchFormLabel}
                control={<Switch value="checkedA" color="primary" />}
                labelPlacement="start"
                label="Student Groups"
              />
            </div>
          </div>
          <div className={classes.formActions}>
            <div className={classes.negativeActions}>
              <Button
                variant="contained"
                className={classes.button}
                size="small"
                style={{backgroundColor: "#f44336", color: "#ffffff"}}
              >
                Cancel
              </Button>
            </div>
            <div className={classes.positiveActions}>
              <Button
                variant="outlined"
                className={classes.button}
                size="small"
              >
                Save For Later
              </Button>
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

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 }
];

export default ClassroomCreator;
