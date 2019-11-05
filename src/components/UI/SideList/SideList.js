//React Imports
import React from "react";
//Material UI Imports
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";

/* TODO: Use my own list */
const SideList = props => {
  //Items above divider
  const sideNavigationItems = [
    { text: "Home", url: "home", icon: <HomeOutlinedIcon /> }
  ];
  //Items below diveider
  const secondSideNavigationItems = [
    {
      text: "Wallet",
      url: "",
      icon: <AccountBalanceWalletOutlinedIcon />
    },
    {
      text: "File Archive",
      url: "file-archive",
      icon: <FolderOutlinedIcon />
    }
  ];
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
        {sideNavigationItems.map(item => (
          <ListItem
            button
            key={item.url}
            onClick={() => {
              props.onChange(null, item.url);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondSideNavigationItems.map((items) => (
          <ListItem
            button
            key={items.url}
            onClick={() => {
              props.onChange(null, items.url);
            }}
          >
            <ListItemIcon>{items.icon}</ListItemIcon>
            <ListItemText primary={items.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SideList;
