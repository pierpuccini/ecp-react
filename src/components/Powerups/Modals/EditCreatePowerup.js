/* React Imports */
import React, { useState, useEffect } from "react";
import "isomorphic-fetch";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
/* App imports */
import axios from "../../../axios/axios";
import DynamicText from "../../UI/SpecialFields/DynamicText";
import FloatingLoader from "../../UI/Loader/FloatingLoader/FloatingLoader";

const useStyles = makeStyles(theme => ({
  inputs: { display: "flex", flexDirection: "column" },
  actions: { display: "flex", justifyContent: "flex-end" },
  button: {
    margin: theme.spacing(1)
  }
}));

const EditCreatePowerup = props => {
  const classes = useStyles();

  const {
    form,
    inputChangedHandler,
    buttonClickHandler,
    teacherId,
    handleAutocompleteChange,
    dbLoading
  } = props;
  /* --- start code for fetching individual classrooms --- */
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await axios.get(`/short-teacher-list/${teacherId}`);
      console.log("response", response);

      if (active) {
        setOptions(response.data.list);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, teacherId]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  /* --- start code for fetching individual classrooms --- */

  //Creacts a valid field object
  let formArr = Object.keys(form).map(controlName => {
    return {
      controlName: controlName,
      data: form[controlName]
    };
  });
  let validFields = formArr.map(item => {
    return {
      [item.controlName]: item.data.valid && item.data.touched
    };
  });
  validFields = Object.assign({}, ...validFields);

  return (
    <div>
    {dbLoading ? <FloatingLoader></FloatingLoader> : null}
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
          style={{ marginBottom: "16px" }}
          value={form.description.value}
          onChange={event => inputChangedHandler(event, "description")}
          label="Description"
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
        <Autocomplete
          id="asynchronous-classrooms"
          style={{ width: 300 }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          getOptionLabel={option => option.subject_name}
          options={options}
          loading={loading}
          onChange={(event, value) => handleAutocompleteChange(event, value)}
          renderInput={params => (
            <TextField
              {...params}
              label="Your Classrooms"
              fullWidth
              variant="outlined"
              helperText="Select one of your available classrooms"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
          renderOption={option => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <DynamicText
                dynamicText={option.subject_name}
                text="Classroom name"
                variantArray={["body2"]}
                type="subtext"
                style={{
                  textTransform: "capitalize",
                  textOverflow: "ellipsis"
                }}
              />
              <DynamicText
                dynamicText={option.subject_id}
                text="Classroom ID"
                variantArray={["body2"]}
                type="subtext"
                style={{
                  textTransform: "capitalize",
                  textOverflow: "ellipsis"
                }}
              />
            </div>
          )}
        />
        <TextField
          classcost={classes.textField}
          value={form.cost.value}
          onChange={event => inputChangedHandler(event, "cost")}
          label="Cost"
          placeholder="5000"
          type="number"
          margin="normal"
          helperText={
            !form.cost.valid && form.cost.touched
              ? "*Powerup's cost. No decimals or negative numbers"
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
          label="Quantity"
          placeholder="25"
          type="number"
          margin="normal"
          helperText={
            !form.quantity.valid && form.quantity.touched
              ? "*Powerup's quantity. No decimals or negative numbers"
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
            !validFields.name &&
            !validFields.description &&
            !validFields.cost &&
            !validFields.quantity
          }
        >
          save
        </Button>
      </div>
    </div>
  );
};

export default EditCreatePowerup;
