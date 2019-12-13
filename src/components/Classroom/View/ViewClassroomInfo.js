/* React imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
//Icons
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";

const useStyles = makeStyles(theme => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between"
  },
  formHeader: {
    display: "flex"
  }
}));

const ViewClassroomInfo = props => {
  const classes = useStyles();

  const { navActions } = props;
  return (
    <div className={classes.infoContainer}>
      <div className={classes.formHeader}>
        <IconButton
          size="small"
          style={{ marginRight: "5px" }}
          onClick={() => {
            navActions();
          }}
        >
          <ArrowBackIosOutlinedIcon />
        </IconButton>
        <Typography style={{ alignSelf: "center" }}>
          Return to classroom List
        </Typography>
      </div>
    </div>
  );
};

export default ViewClassroomInfo;
