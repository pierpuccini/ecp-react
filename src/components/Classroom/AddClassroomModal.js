//React Imports
import React from "react";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  customTypography: {
    fontWeight: "500",
    fontSize: "1.2rem"
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
  dense: {
    marginTop: theme.spacing(2)
  },
  MuiMenuList: {
    width: "auto !important"
  },
  codeVerifError: {
    textAlign: "center",
    color: "#f44336",
    fontSize: "small"
  },
  customHeader: {
    display: "flex",
    justifyContent: "space-between"
  },
  subHeader: {
    fontWeight: "100",
    fontSize: "0.8rem",
    marginTop: "8px"
  }
}));

const Onboarding = props => {
  const matClasses = useStyles();
  let { addClassroomForm, addClassroomFormChanged, submitHandler, error } = props;

  let errorMessage = null;
  if (error) {
    errorMessage = (
      <div className={matClasses.codeVerifError}>{error.message}</div>
    );
  }

  return (
    <Container className={matClasses.onboardingContainer}>
      <CssBaseline />
      <div className={matClasses.customHeader}>
        <Typography className={matClasses.customTypography}>
          Register your subject
        </Typography>
        <Icon>
          <MenuBookOutlinedIcon />
        </Icon>
      </div>
      <Typography className={matClasses.subHeader}>Enter the code provided by your teacher</Typography>
      {errorMessage}
      <form className={matClasses.container} onSubmit={submitHandler}>
        <TextField
          className={matClasses.textField}
          label="Classroom Code"
          value={addClassroomForm.linkCode.value}
          onChange={event => {
            addClassroomFormChanged(event, "linkCode");
          }}
          type="text"
          margin="normal"
          variant="outlined"
          required
        />
        <Button
          className={matClasses.button}
          variant="contained"
          color="primary"
          type="submit"
          disabled={!addClassroomForm.linkCode.valid}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Onboarding;
