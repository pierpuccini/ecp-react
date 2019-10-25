//React Imports
import React from "react";
//Material UI Imports
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

/* TODO: Use my own list */
const SideList = (props) => {
  const sideNavigationItems = [{text: "Home", url: "home", icon: (<HomeOutlinedIcon/>) }];
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
        {sideNavigationItems.map((item) => (
          <ListItem button key={item.url} onClick={()=>{props.onChange(null, item.url)}}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.url} />
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
