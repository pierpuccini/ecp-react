/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  inputs: { display: "flex", flexDirection: "column" },
  actions: { display: "flex", justifyContent: "flex-end" },
  button: {
    margin: theme.spacing(1)
  }
}));

const EditCreatePowerup = props => {
  const classes = useStyles();

  const { form, inputChangedHandler, buttonClickHandler } = props;
  return (
    <div>
      <div className={classes.inputs}>
        <TextField
          value={form.name.value}
          onChange={event => inputChangedHandler(event, "name")}
          label="Name"
          placeholder="Duplicate"
          type="text"
          margin="normal"
          helperText={
            !form.name.valid && form.name.touched
              ? "*Please Enter your powerup's name"
              : "Enter your powerup's name"
          }
          error={!form.name.valid && form.name.touched}
          variant="outlined"
          required
        />
        <TextField
          classdescription={classes.textField}
          value={form.description.value}
          onChange={event => inputChangedHandler(event, "description")}
          label="description"
          placeholder="x2 Duplicate"
          type="text"
          margin="normal"
          helperText={
            !form.description.valid && form.description.touched
              ? "*Please Enter your powerup's description"
              : "Enter your powerup's description"
          }
          error={!form.description.valid && form.description.touched}
          variant="outlined"
          multiline
          rows="5"
          required
        />
        <TextField
          classcost={classes.textField}
          value={form.cost.value}
          onChange={event => inputChangedHandler(event, "cost")}
          label="cost"
          placeholder="5000"
          type="number"
          margin="normal"
          helperText={
            !form.cost.valid && form.cost.touched
              ? "*Please Enter your powerup's cost"
              : "Enter your powerup's cost"
          }
          error={!form.cost.valid && form.cost.touched}
          variant="outlined"
          required
        />
        <TextField
          classquantity={classes.textField}
          value={form.quantity.value}
          onChange={event => inputChangedHandler(event, "quantity")}
          label="quantity"
          placeholder="25"
          type="number"
          margin="normal"
          helperText={
            !form.quantity.valid && form.quantity.touched
              ? "*Please Enter your powerup's quantity"
              : "Enter your powerup's quantity"
          }
          error={!form.quantity.valid && form.quantity.touched}
          variant="outlined"
          required
        />
      </div>
      <div className={classes.actions}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => {
            buttonClickHandler("cancel");
          }}
          size="small"
          style={{ color: "#fff", backgroundColor: "#f44336" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => {
            buttonClickHandler("save");
          }}
          size="small"
          color="primary"
          disabled={
            !form.name.valid &&
            !form.description.valid &&
            !form.cost.valid &&
            !form.quantity.valid
          }
        >
          save
        </Button>
      </div>
    </div>
  );
};

export default EditCreatePowerup;
