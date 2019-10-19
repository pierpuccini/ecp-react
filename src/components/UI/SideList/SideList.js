//React Imports
import React from "react";
//Material UI Imports
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

/* TODO: Use my own list */
const SideList = (props) => {
  const sideNavigationItems = ["Inbox", "Starred", "Send email", "Drafts"];
  return (
    <div
      role="presentation"
      onClick={() => {
        props.toggleDrawer(false);
      }}
      onKeyDown={() => {
        props.toggleDrawer(false);
      }}
    >
      <List>
        {sideNavigationItems.map((items, index) => (
          <ListItem button key={items}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={items} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((items, index) => (
          <ListItem button key={items}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={items} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SideList;
