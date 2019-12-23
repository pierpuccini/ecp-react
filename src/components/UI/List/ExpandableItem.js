/* React Imports */
import React, { useState } from "react";
/* Material ui Imports */
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
//Icons
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

/**
 * @icons: First position is outer icon
 * @text: Content to place in outer list element
 * @list: list to map inside collapse, primary must be set as NAME
 * @endListComp: end component on list
 * @startListComp: start component on list
 * @comp: component at end of expandable list
 * @param {*} props
 * @returns
 */
const ExpandableItem = props => {
  const classes = useStyles();
  const { icons, text, list, comp /* endListComp, startListComp */ } = props;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{icons[0]}</ListItemIcon>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {list.map(item => {
            return (
              <ListItem key={item.id} className={classes.nested}>
                <ListItemIcon>{icons[1]}</ListItemIcon>
                <ListItemText
                  primary={item.name}
                  style={{ textTransform: "capitalize" }}
                />
              </ListItem>
            );
          })}
          {comp}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default ExpandableItem;
