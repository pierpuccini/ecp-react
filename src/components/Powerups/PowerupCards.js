/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content: {},
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
}));
const PowerupCards = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { viewType, role, actionHandler, powerup } = props;
  console.log("powerup", powerup);
  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <div className={classes.header}>
        <DynamicText
          dynamicText={powerup.name}
          text={powerup.description}
          variantArray={["body1"]}
          type="subtext"
          style={{width: "225px"}}
        />
        {role === "teacher" ? (
          <div>
            <IconButton color="primary">
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              style={{ color: "#f44336" }}
              onClick={() => actionHandler("delete", powerup.id)}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </div>
        ) : (
          <Tooltip placement="left" title="Edit Powerup">
            <Icon>
              <InfoOutlinedIcon />
            </Icon>
          </Tooltip>
        )}
      </div>
      <div className={classes.content}>cost: {powerup.cost}</div>
      <div className={classes.actions}>
        <IconButton>
          <RemoveOutlinedIcon />
        </IconButton>
        <Typography style={{ alignSelf: "center" }}>
          {powerup.quantity}
        </Typography>
        <IconButton>
          <AddOutlinedIcon />
        </IconButton>
      </div>
    </Paper>
  );
};
/* name, description, cost, cuantity */
export default PowerupCards;
