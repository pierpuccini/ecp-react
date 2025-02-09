/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
/* App Imports */
import DynamicText from "../../components/UI/SpecialFields/DynamicText";
import CoinIcon from "../UI/CoinIcon/CoinIcon";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset",
      border: "2px solid"
    }
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
}));

const PowerupInfoCard = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { viewType, handlePowerupModal } = props;

  let title = viewType === "manage" ? "Managing power ups" : "Buy power ups";
  let endItem = (
    <div style={{ display: "flex" }}>
      <DynamicText
        mainText={"5000"}
        text="My total coins"
        variantArray={["body1"]}
        type="subtext"
        icon={<CoinIcon width="24px" height="24px" />}
        style={{ margin: "16px 8px 0px 0px" }}
      />
    </div>
  );
  if (viewType === "manage") {
    endItem = (
      <Tooltip placement="left" title="Create Powerup">
        <IconButton
          onClick={() => {
            handlePowerupModal();
          }}
        >
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <div className={classes.content}>
        <Typography style={{ alignSelf: "center" }}>{title}</Typography>
        {endItem}
      </div>
    </Paper>
  );
};

export default PowerupInfoCard;
