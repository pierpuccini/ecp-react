import React, { useState } from "react";
//Material UI Imports
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
//App Imports
import CoinIcon from '../../CoinIcon/CoinIcon'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      textTransform: "capitalize"
    }
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  menuItem: {
    justifyContent: "space-between"
  }
}));

const Topbar = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  
  const viewAccount = () => {
    handleMenuClose();
    handleMobileMenuClose();
    props.viewAccountHandler(null , 'my-account');
  }

  const logout = typeOfScreen => {
    typeOfScreen === "desktop" ? handleMenuClose() : handleMobileMenuClose();
    props.logout();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
    >
      {props.newUser ? null : (
        <MenuItem className={classes.menuItem} onClick={viewAccount}>
          <AssignmentIndOutlinedIcon />
          <Typography>My Account</Typography>
        </MenuItem>
      ) }
      <MenuItem
        className={classes.menuItem}
        onClick={() => {
          logout("desktop");
        }}
      >
        <PowerSettingsNewOutlinedIcon />
        <Typography>Sign Out</Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      TransitionComponent={Fade}
    >
      {props.newUser ? null : (
        <MenuItem className={classes.menuItem}>
          <Badge variant="dot" color="secondary">
            <NotificationsNoneOutlinedIcon />
          </Badge>
          <Typography>Notifications</Typography>
        </MenuItem>
      )}
      {props.newUser ? null : (
        <MenuItem className={classes.menuItem} onClick={viewAccount}>
          <AssignmentIndOutlinedIcon />
          <Typography>My Account</Typography>
        </MenuItem>
      )}
      <MenuItem
        className={classes.menuItem}
        onClick={() => {
          logout("desktop");
        }}
      >
        <PowerSettingsNewOutlinedIcon />
        <Typography>Sign Out</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <React.Fragment>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        disabled={props.newUser}
        onClick={() => {
          props.toggleDrawer(!props.drawerState);
        }}
      >
        <MenuIcon />
      </IconButton>
      <div style={{ display: "flex" }}>
        {props.title === "Edu Coins" ? (
          <CoinIcon width="32px" height="32px" />
        ) : null}
        <Typography className={classes.title} variant="h6" noWrap>
          {props.title}
        </Typography>
      </div>
      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>
        {props.newUser ? null : (
          <IconButton aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={17} color="secondary">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        )}
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircleOutlinedIcon />
        </IconButton>
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          {props.newUser ? (
            <AccountCircleOutlinedIcon />
          ) : (
            <Badge
              badgeContent={mobileMoreAnchorEl ? null : 11}
              color="secondary"
            >
              <AccountCircleOutlinedIcon />
            </Badge>
          )}
        </IconButton>
      </div>
      {renderMobileMenu}
      {renderMenu}
    </React.Fragment>
  );
};

export default Topbar;
