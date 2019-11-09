/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
  }
}));

const ClassroomManager = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.classroomContainer}>
      <Paper className={classes.paper}>
        <form>
          <Typography>Chose or Create Classroom</Typography>
          <div className={classes.codeAndNameContainer}>
            <TextField
              className={classes.textField}
              label="Institution"
              placeholder="Universidad del Norte"
              type="text"
              margin="normal"
              variant="outlined"
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
                  label="Classroom Code"
                  placeholder="3752"
                  margin="normal"
                  variant="outlined"
                  fullWidth
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
            />
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

export default ClassroomManager;
