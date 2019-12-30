/* React Imports */
import React, { useState, useEffect } from "react";
import "isomorphic-fetch";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Slider from "@material-ui/core/Slider";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
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
  },
  costAndQuantity: { display: "flex", flexDirection: "row" },
  benefitContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column"
  },
  slider: {
    padding: theme.spacing(1, 3)
  },
  benefitCreator: {
    display: "flex"
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
    benefitChangeHandler,
    dbLoading
  } = props;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([form.classroom.value]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await axios.get(`/short-teacher-list/${teacherId}`);

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

  //Creates a valid field object
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

  const benefitType = [
    <ToggleButton key={1} value="*">
      <Typography>Multiply</Typography>
    </ToggleButton>,
    <ToggleButton key={2} value="/">
      <Typography>Divide</Typography>
    </ToggleButton>
  ];

  const benefitValue = [
    {
      value: 1,
      label: "1"
    },
    {
      value: 10,
      label: "10"
    }
  ];

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
          size="small"
          required
        />
        <div className={classes.benefitCreator}>
          <div className={classes.benefitContainer}>
            <Typography gutterBottom variant="body2">
              Benefit's type
            </Typography>
            <ToggleButtonGroup
              value={form.benefit.value.type}
              onChange={(event, value) => {
                benefitChangeHandler(event, value, "type");
              }}
              size="small"
              exclusive
            >
              {benefitType}
            </ToggleButtonGroup>
          </div>
          <div className={classes.benefitContainer} style={{ width: "100%" }}>
            <Typography
              style={{ marginLeft: "16px" }}
              gutterBottom
              variant="body2"
            >
              Benefit's value
            </Typography>
            <div className={classes.slider}>
              <Slider
                defaultValue={15}
                value={form.benefit.value.value}
                valueLabelDisplay="auto"
                onChange={(event, value) => {
                  benefitChangeHandler(event, value, "value");
                }}
                step={1}
                marks={benefitValue}
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>
        <TextField
          style={{ marginBottom: "16px" }}
          value={form.description.value}
          label="Description"
          placeholder="x2 Duplicate"
          type="text"
          margin="normal"
          helperText={
            !form.description.valid && form.description.touched
              ? "*Please Enter your powerup's benifit"
              : "This is the powerup's description"
          }
          error={!form.description.valid && form.description.touched}
          variant="outlined"
          multiline
          InputProps={{
            readOnly: true
          }}
          size="small"
          required
        />
        <Autocomplete
          id="asynchronous-classrooms"
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          autoHighlight
          autoSelect
          getOptionLabel={option => option.subject_name}
          options={options}
          loading={loading}
          value={form.classroom.value != null ? form.classroom.value : ""}
          onChange={(event, value) => handleAutocompleteChange(event, value)}
          renderInput={params => {
            const inputProps = params.inputProps;
            inputProps.autoComplete = "off";
            return (
              <TextField
                {...params}
                inputProps={inputProps}
                label="Your Classrooms"
                fullWidth
                variant="outlined"
                helperText="Select one of your available classrooms"
                autoComplete="off"
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
            );
          }}
          renderOption={option => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <DynamicText
                mainText={option.subject_name}
                text="Classroom name"
                variantArray={["body2"]}
                type="subtext"
                style={{
                  textTransform: "capitalize",
                  textOverflow: "ellipsis"
                }}
              />
              <DynamicText
                mainText={option.subject_id}
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
        <div className={classes.costAndQuantity}>
          <TextField
            style={{ marginRight: "8px" }}
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
            size="small"
            required
          />
          <TextField
            style={{ marginLeft: "8px" }}
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
            size="small"
            required
          />
        </div>
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
            buttonClickHandler("save", form.id);
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
