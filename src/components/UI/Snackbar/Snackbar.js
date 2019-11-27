/* React Imports */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
/* Material UI imports */
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
//Icons
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseIcon from "@material-ui/icons/Close";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";

const variantIcon = {
  success: CheckCircleOutlineOutlinedIcon,
  warning: ReportProblemOutlinedIcon,
  error: ErrorOutlineOutlinedIcon,
  info: InfoOutlinedIcon
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

const MySnackbarContentWrapper = props => {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["error", "info", "success", "warning"]).isRequired
};

const Snackbars = props => {
  const { payload } = props;
  console.log('payload',payload);
  const [open, setOpen] = useState();
  const matches = useMediaQuery('(min-width: 600px)');

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  let anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  }
  if (matches) {
    anchorOrigin = {
      vertical: "top",
      horizontal: "right"
    }
  }

  let variant, message;
  if (payload !== null) {
    variant = payload.type;
    message = payload.info.customErrorMsg
      ? payload.info.customErrorMsg
      : payload.info.message;
  }

  useEffect(() => {
    if (payload !== null) {
      setOpen(true);
    }
    // eslint-disable-next-line
  }, []);

  return (
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={variant}
          message={message}
        />
      </Snackbar>
  );
};

export default Snackbars;
