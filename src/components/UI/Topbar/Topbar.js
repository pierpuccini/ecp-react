import React, { useState } from "react";
//Material UI Imports
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fade from '@material-ui/core/Fade';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
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
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = (typeOfScreen) => {
    (typeOfScreen === 'desktop')?handleMenuClose():handleMobileMenuClose();
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
      <MenuItem className={classes.menuItem} onClick={handleMenuClose}>
        <AccountCircleOutlinedIcon />
        <Typography>My Account</Typography>
      </MenuItem>
      <MenuItem className={classes.menuItem} onClick={()=>{logout('desktop')}}>
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
      <MenuItem className={classes.menuItem}>
        <Badge badgeContent={11} color="secondary">
          <NotificationsNoneOutlinedIcon />
        </Badge>
        <Typography>Notifications</Typography>
      </MenuItem>
      <MenuItem className={classes.menuItem}>
        <AccountCircleOutlinedIcon />
        <Typography>My Account</Typography>
      </MenuItem>
      <MenuItem className={classes.menuItem} onClick={()=>{logout('desktop')}}>
        <PowerSettingsNewOutlinedIcon />
        <Typography>Sign Out</Typography>
      </MenuItem>
    </Menu>
  );
  return (
    <React.Fragment>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
        onClick={()=>{props.toggleDrawer(!props.drawerState)}}
      >
        <MenuIcon />
      </IconButton>
      <Typography className={classes.title} variant="h6" noWrap>
        Material-UI
      </Typography>
      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>
        <IconButton aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar className={classes.purpleAvatar}>
            {props.initials}
          </Avatar>
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
          <Badge badgeContent={(mobileMoreAnchorEl)? null :11} color="secondary">
            <Avatar className={classes.purpleAvatar}>
              {props.initials}
            </Avatar>
          </Badge>
        </IconButton>
      </div>
      {renderMobileMenu}
      {renderMenu}
    </React.Fragment>
  );
};

export default Topbar;
