/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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
  }
}));

const EditUsersCard = props => {
  const classes = useStyles();
  const {
    user,
    openCardHandler,
    clients,
    userManagerEditor,
    inputChangedHandler
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
    <div>
      <Typography>Editing user</Typography>
      {user.displayName}
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
      <button
        onClick={() => {
          openCardHandler("close");
        }}
      >
        Close card
      </button>
    </div>
  );
};

export default EditUsersCard;
