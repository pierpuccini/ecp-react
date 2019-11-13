/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles(theme => ({
  switch: {
    display: "flex",
    justifyContent: "space-between"
  },
  typography: {
    alignSelf: "center"
  },
  typographyContainer: {
    display: "flex"
  }
}));

const CustomSwitch = props => {
  const classes = useStyles();

  let labelPlacement;
  switch (props.labelPlacement) {
    case "left":
      labelPlacement = { flexDirection: "row !important" };
      break;

    case "right":
      labelPlacement = { flexDirection: "row-reverse !important" };
      break;
  }

  return (
    <div className={classes.switch} style={labelPlacement}>
      <div className={classes.typographyContainer}>
        <Typography className={classes.typography}>{props.label}</Typography>
        {props.icon}
      </div>
      <Switch
        value={props.value}
        color={props.color}
        checked={props.checked}
        onChange={props.onChange}
      />
    </div>
  );
};

export default CustomSwitch;
