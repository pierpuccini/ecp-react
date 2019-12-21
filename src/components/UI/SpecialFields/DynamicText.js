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
  },
  // subtext
  captions: {
    color: theme.palette.text.hint
  },
  textAndIcon: {
    display: "flex"
  }
}));

/**
 * @Dynamic text is the one that will always change
 * @Text is your static text
 * @Orientation: vertical horizantal
 * @icon
 * @variant Array, [0] = static text & [1] dynamic text
 * @style normal css styling
 * @type:
 *  -subtext: provides information uptop description bellow in grey
 *  -norrmal: description and information separated by colon
 *  *Type does NOT require a variantArry pos 2
 * @capitalize: If exisits, capitalize the dynamic info
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
    style,
    type,
    capitalize
  } = props;
  if (type === "subtext") {
    return (
      <div className={classes.vertical} style={style}>
        <div className={classes.textAndIcon}>
          {icon}
          {component == null ? (
            <Typography
              style={
                icon != null
                  ? { marginLeft: "8px" }
                  : capitalize
                  ? { textTransform: "capitalize" }
                  : null
              }
              variant={variantArray[0]}
            >
              {dynamicText}
            </Typography>
          ) : (
            component
          )}
        </div>
        <Typography variant="caption" className={classes.captions}>
          {text}
        </Typography>
      </div>
    );
  }
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
