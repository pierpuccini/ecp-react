/* React Imports */
import React, { useState } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
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
    minWidth: "150px",
    flexDirection: "column"
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(1)
  },
  footerActions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  },
  buyPowerup: {
    color: green[700]
  },
  removePowerup: {
    color: theme.palette.error.main
  },
  quantityContainer: {
    display: "flex",
    flexDirection: "column"
  },
  quantityError: {
    color: theme.palette.error.main
  },
  addRemoveContainer: {
    display: "flex"
  },
  buying: {
    display: "flex",
    flexDirection: "column"
  }
}));

const PowerupCards = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { viewType, actionHandler, powerup, handleClassroomCart } = props;

  const [localPowerupQuantity, setlocalPowerupQuantity] = useState(0);
  const [quantityError, setquantityError] = useState(false);

  const handleCart = type => {
    const { quantity } = powerup;
    let counter = localPowerupQuantity;
    if (type === "+") {
      counter += 1;
      if (counter > quantity) {
        counter -= 1;
        setquantityError(true);
      }
    } else {
      if (counter === quantity) {
        setquantityError(false);
      }
      counter -= 1;
      if (counter < 0) {
        counter += 1;
      }
    }
    setlocalPowerupQuantity(counter);
    let data = {
      counter,
      powerup,
      classroom: powerup.classroom.subject_name,
      type
    };
    handleClassroomCart(data);
  };

  let cardActions = (
    <div className={classes.footer}>
      <div className={classes.costAndQuantity}>
        <DynamicText
          mainText={powerup.cost}
          text="Power up cost"
          variantArray={["body1"]}
          type="subtext"
          icon={<CoinIcon width="24px" height="24px" />}
        />
        <DynamicText
          mainText={powerup.quantity}
          text="Quantity"
          variantArray={["body1"]}
          type="subtext"
        />
      </div>
      <div className={classes.footerActions}>
        <div className={classes.quantityContainer}>
          <Typography
            variant="body2"
            style={{ paddingLeft: "16px" }}
          >{`My powerups: 0`}</Typography>
        </div>
        <div className={classes.addRemoveContainer}>
          <span>
            <IconButton
              className={classes.removePowerup}
              onClick={() => {
                handleCart("-");
              }}
            >
              <RemoveOutlinedIcon />
            </IconButton>
          </span>
          <div className={classes.buying}>
            <Typography variant="body2" style={{ textAlign: "center" }}>
              {localPowerupQuantity}
            </Typography>
            <Typography variant="caption">Buying</Typography>
          </div>
          <span>
            <IconButton
              className={classes.buyPowerup}
              onClick={() => {
                handleCart("+");
              }}
            >
              <AddOutlinedIcon />
            </IconButton>
          </span>
        </div>
      </div>
    </div>
  );
  if (viewType === "manage") {
    cardActions = (
      <div className={classes.footer}>
        <div
          className={classes.costAndQuantity}
          style={{ flexDirection: "unset" }}
        >
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
        <div
          className={classes.footerActions}
          style={{ flexDirection: "unset" }}
        >
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
      {quantityError ? (
        <Typography variant="body2" className={classes.quantityError}>
          There are no more powerups to buy
        </Typography>
      ) : null}
      {cardActions}
    </Paper>
  );
};

export default PowerupCards;
