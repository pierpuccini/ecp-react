/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
//Icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
/* App Imports */
import DynamicText from "../UI/SpecialFields/DynamicText";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
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

  const { viewType, role } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.header}>
        <DynamicText
          dynamicText="Duplicate"
          text="x2 Duplication"
          variantArray={["body1"]}
          type="subtext"
        />
        {role === "teacher" ? (
          <div>
            <IconButton color="primary">
              <EditOutlinedIcon />
            </IconButton>
            <IconButton style={{ color: "#f44336" }}>
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
      <div className={classes.content}>cost: 300</div>
      <div className={classes.actions}>
        <IconButton>
          <RemoveOutlinedIcon />
        </IconButton>
        <Typography style={{alignSelf: "center"}}>5</Typography>
        <IconButton>
          <AddOutlinedIcon />
        </IconButton>
      </div>
    </Paper>
  );
};
/* name, description, cost, cuantity */
export default PowerupCards;
