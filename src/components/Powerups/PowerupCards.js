/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { green } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
//Icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
/* App Imports */
import DynamicText from "../UI/SpecialFields/DynamicText";
import CoinIcon from "../UI/CoinIcon/CoinIcon";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2, 0, 2),
    margin: theme.spacing(2),
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset",
      border: "2px solid"
    }
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nameAndDescription: {
    height: "64px",
    overflow: "hidden"
  },
  costAndQuantity: {
    display: "flex",
    paddingBottom: "12px",
    minWidth: "150px"
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerActions: {
    display: "flex"
  },
  buyPowerup: {
    color: green[700]
  },
  removePowerup: {
    color: theme.palette.error.main
  }
}));

const PowerupCards = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { viewType, actionHandler, powerup } = props;

  let cardActions = (
    <div className={classes.footer}>
      <div className={classes.costAndQuantity}>
        <DynamicText
          mainText={powerup.cost}
          text="Power up cost"
          variantArray={["body1"]}
          type="subtext"
          icon={<CoinIcon width="24px" height="24px" />}
          style={{ marginRight: "8px" }}
        />
        <DynamicText
          mainText={powerup.quantity}
          text="Quantity"
          variantArray={["body1"]}
          type="subtext"
          style={{ marginLeft: "8px" }}
        />
      </div>
      <div className={classes.footerActions}>
        <Tooltip placement="left" title="Remove powerup">
          <span>
            <IconButton className={classes.removePowerup}>
              <RemoveOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip placement="left" title="Buy powerup">
          <span>
            <IconButton className={classes.buyPowerup}>
              <AddOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
  if (viewType === "manage") {
    cardActions = (
      <div className={classes.footer}>
        <div className={classes.costAndQuantity}>
          <DynamicText
            mainText={powerup.cost}
            text="Power up cost"
            variantArray={["body1"]}
            type="subtext"
            icon={<CoinIcon width="24px" height="24px" />}
            style={{ margin: "16px 8px 0px 0px" }}
          />
          <DynamicText
            mainText={powerup.quantity}
            text="Quantity"
            variantArray={["body1"]}
            type="subtext"
            style={{ margin: "16px 0px 0px 8px" }}
          />
        </div>
        <div className={classes.footerActions}>
          <span style={{ alignSelf: "center" }}>
            <IconButton
              style={{ color: "#f44336" }}
              onClick={() => actionHandler("delete", powerup.id)}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </span>
          <span style={{ alignSelf: "center" }}>
            <IconButton
              color="primary"
              onClick={() => actionHandler("edit", powerup)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </span>
        </div>
      </div>
    );
  }
  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <div className={classes.header}>
        <div className={classes.nameAndDescription}>
          <DynamicText
            mainText={powerup.name}
            text={powerup.description}
            variantArray={["body1"]}
            type="subtext"
          />
        </div>
        <Tooltip placement="left" title={powerup.description}>
          <Icon>
            <InfoOutlinedIcon />
          </Icon>
        </Tooltip>
      </div>
      {cardActions}
    </Paper>
  );
};

export default PowerupCards;
