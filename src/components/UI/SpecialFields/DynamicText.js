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
 * @[NOWRAP]: in order for ellipisis to take effect, add overflow hidden to parent div where using comps
 * @param [mainText]: text is the one that will always change OR Main text (1)
 * @param [text]: is your static text OR Seconday Text (2)
 * @param [orientation]: vertical horizantal
 * @param [icon]
 * @param [variantArray]: [0] = static text & [1] dynamic text
 * @param [component]: custom text component
 * @param [style] normal css styling
 * @param [capitalize]: If exisits, capitalize the dynamic info
 * @param [type]:
 *  @[type] subtext: provides information uptop description bellow in grey
 *  @[type] norrmal: description and information separated by colon
 *  @[type] DOES NOT require a variantArry pos 2
 */
const DynamicText = props => {
  const classes = useStyles();

  const {
    mainText,
    text,
    orientation,
    icon,
    variantArray,
    component,
    style,
    capitalize,
    type
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
              {mainText}
            </Typography>
          ) : (
            component
          )}
        </div>
        <Typography  variant="caption" className={classes.captions}>
          {text}
        </Typography>
      </div>
    );
  }
  return (
    <div className={classes[orientation]} style={style}>
      {icon}
      <Typography  variant={variantArray[0]}>
        {text}:
      </Typography>
      {component == null ? (
        <Typography
          
          variant={variantArray[1]}
          className={classes.dtext}
          style={orientation !== "vertical" ? { margin: "0px 8px" } : null}
        >
          {mainText}
        </Typography>
      ) : (
        component
      )}
    </div>
  );
};

export default DynamicText;
