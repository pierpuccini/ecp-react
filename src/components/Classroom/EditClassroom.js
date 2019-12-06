/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
//Icons
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
/* App Imports */
import CodeCopy from "../UI/SpecialFields/CodeCopy";

const useStyles = makeStyles(theme => ({
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
  dense: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  },
  MuiMenuList: {
    width: "auto !important"
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

const EditClassroom = props => {
  const classes = useStyles();
  const {
    navActions,
    updateClassroomInfo,
    updateClassroomForm,
    institutions,
    inputChangedHandler
  } = props;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

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

  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
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
          Edit or View classroom
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
        <TextField
          className={classes.textField}
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
              : null
          }
          error={
            !updateClassroomForm.subject_name.valid &&
            updateClassroomForm.subject_name.touched
          }
          variant="outlined"
          required
        />
      </div>
      <div className={classes.classCodeContainer}>
        <CodeCopy value={updateClassroomInfo.code_classroom} label="Class Code" helper="Share code with students"/>
      </div>
    </Paper>
  );
};

export default EditClassroom;
