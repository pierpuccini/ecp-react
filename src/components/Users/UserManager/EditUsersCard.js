/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "column"
  },
  MuiMenuList: {
    width: "auto !important"
  },
  userDisplayName: {
    textTransform: "capitalize"
  },
  button: {
    margin: theme.spacing(1)
  },
  editCardContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  editActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
}));

const EditUsersCard = props => {
  const classes = useStyles();
  const {
    user,
    openCardHandler,
    clients,
    userManagerEditor,
    inputChangedHandler,
    isMobile
  } = props;

  clients.sort((a, b) => {
    var textA = a.value.toUpperCase();
    var textB = b.value.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  const roles = [
    {
      id: 1,
      value: "admin"
    },
    {
      id: 2,
      value: "teacher"
    },
    {
      id: 3,
      value: "student"
    }
  ];

  return (
    <div className={classes.editCardContainer}>
      {isMobile ? null : (
        <div className={classes.editCardHeader}>
          <Typography>Editing user</Typography>
          <div className={classes.userDisplayName}>{user.displayName}</div>
        </div>
      )}
      <div className={classes.inputsContainer}>
        <TextField
          className={classes.textField}
          label="Institution"
          select
          placeholder="Select Your Institution"
          value={userManagerEditor.institution.value.id}
          onChange={event => {
            inputChangedHandler(event, "institution");
          }}
          margin="normal"
          variant="outlined"
        >
          {clients.map(option => (
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
          label="Role"
          placeholder="Admin"
          type="text"
          value={userManagerEditor.role.value}
          onChange={event => inputChangedHandler(event, "role")}
          margin="normal"
          variant="outlined"
          select
        >
          {roles.map(option => (
            <MenuItem
              className={classes.MuiMenuList}
              key={option.id}
              value={option.value}
            >
              {option.value}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className={classes.editActions}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => {
            openCardHandler("close");
          }}
          size="small"
          style={{ backgroundColor: "#f44336", color: "#ffffff" }}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditUsersCard;
