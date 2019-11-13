/* React imports */
import React from "react";
import { withRouter } from "react-router-dom";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
//Icons
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
/* App Imports */
import classes from "./PermisionError.module.scss";
import ErrorLogo from "../ErrorLogo/ErrorLogo";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const PermisionError = (props) => {
  const matClasses = useStyles();

  const handleNavChange = () => {
    props.history.replace('/home')
  };

  return (
    <div className={classes.errorContainer}>
      <div className={classes.errorImgContainer}>
        <ErrorLogo height="85px" />
      </div>
      <div className={classes.errorTextContainer}>
        <Typography color="error" style={{ marginRight: "5px" }}>
          ERROR!!!
        </Typography>
        <Typography color="textPrimary" variant="body2">
          You do not have permision to view this page, please contact your
          adminstrator.
        </Typography>
      </div>
      <div className={classes.locationButtons}>
        <Button
          variant="contained"
          color="primary"
          className={matClasses.button}
          endIcon={<HomeOutlinedIcon />}
          onClick={() => {
            handleNavChange();
          }}
        >
          go home
        </Button>
      </div>
    </div>
  );
};

export default withRouter(PermisionError);
