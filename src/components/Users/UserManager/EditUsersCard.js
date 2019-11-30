/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "column"
  }
}));

const EditUsersCard = props => {
  const classes = useStyles();
  const { user, openCardHandler } = props;

  return (
    <div>
      <Typography>Editing user</Typography>
      {user.displayName}
      <div className={classes.inputsContainer}>
        <TextField
          className={classes.textField}
          label="Institution"
          placeholder="Universidad"
          type="text"
          value
          onChange={event => props.inputChangedHandler(event, "displayName")}
          margin="normal"
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          label="Role"
          placeholder="Admin"
          type="text"
          value
          onChange={event => props.inputChangedHandler(event, "displayName")}
          margin="normal"
          variant="outlined"
        />
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
