/* React Imports */
import React, { useState, useEffect } from "react";
/* Redux Imports */
import { connect } from "react-redux";
// import * as actions from "./store/actions/index";
/* Material UI Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
//Icons
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
/* App Imports */
import formatDistance from "date-fns/formatDistance";
import TitleDivider from "../../components/UI/SpecialFields/TitleDivider";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  menuItem: {
    justifyContent: "space-between"
  },
  menuContent: {
    display: "flex",
    flexDirection: "column"
  },
  NotificationMessage: {
    maxWidth: "350px",
    whiteSpace: "pre-wrap"
  }
}));

const Notifications = props => {
  const classes = useStyles();
  /* Type refers to, icon and badge or menu Item */
  const {
    type,
    notificationsFromFB,
    handleNotificationsClose,
    notificationanchorEl,
    isMenuOpenNotifications
  } = props;

  const [notifications, setnotifications] = useState(notificationsFromFB);
  const [totalNotifications, settotalNotifications] = useState(0);

  useEffect(() => {
    Object.keys(notifications).forEach(notificationType => {
      let total = totalNotifications + notifications[notificationType].length;
      settotalNotifications(total);
    });
  }, [notifications]);

  const clearHandler = (type, notificationType, index) => {
    console.log(type, notificationType);
    let deletedNotifications;
    if (type === "all") {
      deletedNotifications = notifications[notificationType] = [];
      handleNotificationsClose();
      console.log(notifications);
    } else {
      deletedNotifications = notifications[notificationType].splice(index, 1);
      console.log(notifications);
    }
    setnotifications(deletedNotifications);
  };

  const clearIcon = (type, notificationType, index) => {
    return (
      <IconButton
        onClick={() => {
          clearHandler(type, notificationType, index);
        }}
      >
        <ClearOutlinedIcon />
      </IconButton>
    );
  };

  const notificationItems = type => {
    return notifications[type].map((item, index) => {
      return (
        <MenuItem
          className={classes.menuItem}
          key={`${item.time.seconds}${item.time.nanoseconds}`}
        >
          <div className={classes.menuContent}>
            <Typography className={classes.NotificationMessage}>
              {item.message}
            </Typography>
            <Typography variant="caption">
              {formatDistance(item.time.toDate(), new Date(), {
                addSuffix: true
              })}
            </Typography>
          </div>
          {clearIcon("", type, index)}
        </MenuItem>
      );
    });
  };

  const menuIdNotifications = "primary-search-accountnotification-menu";
  const renderMenuNotifications = (
    <Menu
      anchorEl={notificationanchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuIdNotifications}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpenNotifications}
      onClose={handleNotificationsClose}
      TransitionComponent={Fade}
    >
      {Object.keys(notifications).map(notificationType => {
        return (
          <div key={notificationType}>
            <TitleDivider
              title={notificationType}
              dividerVariant="middle"
              style={{ margin: "0px 8px" }}
              endComponent={clearIcon("all", notificationType)}
            />
            {notificationItems(notificationType)}
          </div>
        );
      })}
    </Menu>
  );
  if (type === "icon") {
    return (
      <div>
        <Badge badgeContent={totalNotifications} max={99} color="secondary">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </div>
    );
  } else {
    return renderMenuNotifications;
  }
};

const mapStateToProps = state => {
  return {
    notificationsFromFB: state.firebase.profile.notifications
  };
};

export default connect(mapStateToProps)(Notifications);
