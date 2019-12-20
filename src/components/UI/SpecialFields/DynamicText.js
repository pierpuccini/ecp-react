/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  vertical: {
    display: "flex",
    flexDirection: "column"
  },
  horizantal: {
    display: "flex",
    flexDirection: "row"
  },
  dtext: {
    alignSelf: "center"
  }
}));

/**
 * Dynamic text is the one that will always change
 * Text is your static text
 * Orientation: vertical horizantal
 * icon
 * variant Array, [0] = static text & [1] dynamic text
 * @param {*} props
 * @returns
 */
const DynamicText = props => {
  const classes = useStyles();

  const {
    dynamicText,
    text,
    orientation,
    icon,
    variantArray,
    component,
    style
  } = props;
  return (
    <div className={classes[orientation]} style={style}>
      {icon}
      <Typography variant={variantArray[0]}>{text}:</Typography>
      {component == null ? (
        <Typography
          variant={variantArray[1]}
          className={classes.dtext}
          style={orientation !== "vertical" ? { margin: "0px 8px" } : null}
        >
          {dynamicText}
        </Typography>
      ) : (
        component
      )}
    </div>
  );
};

export default DynamicText;
