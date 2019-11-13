/* React imports */
import React from "react";
/* Material Imports */
import Typography from "@material-ui/core/Typography";
/* App Imports */
import classes from "./PermisionError.module.scss";
import ErrorLogo from "../ErrorLogo/ErrorLogo";

const PermisionError = () => {
  return (
    <div className={classes.errorContainer}>
      <div className={classes.errorImgContainer}>
          <ErrorLogo height="85px" />
      </div>
      <div className={classes.errorTextContainer}>
          <Typography color="error" style={{marginRight: "5px"}}>
            ERROR!!!
            </Typography>
            <Typography  color="textPrimary" variant="body2">
              You do not have permision to view this page, please contact your
              adminstrator.
            </Typography>
      </div>
    </div>
  );
};

export default PermisionError;
