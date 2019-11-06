//React Imports
import React from "react";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
//Icons
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";
import PlaceOutlinedIcon from "@material-ui/icons/PlaceOutlined";
//App imports
import coinIcon from '../../../assets/images/coin-logo.png'

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: "100%"
  },
  iconRootCoin: {
    textAlign: "center",
    width: "32px",
    height: "32px",
    "font-size": "unset"
  }
}));

/* TODO: Use my own list */
const SideList = props => {
  const classes = useStyles();  
  //Items above divider
  const sideNavigationItems = [
    {
      text: "EduCoins",
      url: "home",
      icon: (
        <Icon classes={{ root: classes.iconRootCoin }}>
          <img className={classes.imageIcon} src={coinIcon} alt="coin icon" />
        </Icon>
      )
    }
  ];
  //Items below diveider
  const secondSideNavigationItems = [
    { 
      text: "Home",
      url: "home",
      icon: <HomeOutlinedIcon />
    },
    {
      text: "Challenges",
      url: "challenges",
      icon: <MenuBookOutlinedIcon />
    },
    {
      text: "Power Ups",
      url: "power-ups",
      icon: <TrendingUpOutlinedIcon />
    },
    {
      text: "Classrooms",
      url: "classrooms",
      icon: <PlaceOutlinedIcon />
    },
    {
      text: "Wallet",
      url: "wallet",
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
        {secondSideNavigationItems.map(items => (
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
